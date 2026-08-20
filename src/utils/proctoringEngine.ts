/**
 * Proctoring Engine
 * Provides cross-platform face detection and Side-Look security violation
 * checks for Web and React Native.
 */

import jpeg from "jpeg-js";

import {
  SECURITY_VIOLATIONS,
  SecurityViolationType,
} from "@/components/proctoring/violations";

export type FaceCheckResult = {
  faceCount: number;
  violation?: SecurityViolationType | null;
  confidence?: number;
};

// ─── Base64 Byte Decoding (Pure TypeScript, zero dependencies) ────────────────
const B64_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_LOOKUP = new Uint8Array(256);
for (let i = 0; i < B64_CHARS.length; i++) {
  B64_LOOKUP[B64_CHARS.charCodeAt(i)] = i;
}

export function decodeBase64ToBytes(base64: string): Uint8Array {
  const clean = base64.replace(/^data:image\/[a-z]+;base64,/, "").trim();
  const len = clean.length;
  if (len === 0) return new Uint8Array(0);

  let padding = 0;
  if (clean.endsWith("==")) padding = 2;
  else if (clean.endsWith("=")) padding = 1;

  const byteLen = Math.floor((len * 3) / 4) - padding;
  const bytes = new Uint8Array(byteLen);

  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const enc1 = B64_LOOKUP[clean.charCodeAt(i)];
    const enc2 = B64_LOOKUP[clean.charCodeAt(i + 1)];
    const enc3 = B64_LOOKUP[clean.charCodeAt(i + 2)];
    const enc4 = B64_LOOKUP[clean.charCodeAt(i + 3)];

    if (p < byteLen) bytes[p++] = (enc1 << 2) | (enc2 >> 4);
    if (p < byteLen) bytes[p++] = ((enc2 & 15) << 4) | (enc3 >> 2);
    if (p < byteLen) bytes[p++] = ((enc3 & 3) << 6) | enc4;
  }
  return bytes;
}

// ─── JPEG Parser & Decoder ────────────────────────────────────────────────────
// Real Huffman/IDCT decode via jpeg-js, downsampled afterwards to keep the
// per-frame pixel analysis below cheap (proctoring runs this every 700ms).
const MAX_DECODE_WIDTH = 120;
const MAX_DECODE_HEIGHT = 90;

export function parseJpeg(
  bytes: Uint8Array,
): { width: number; height: number; data: Uint8Array } | null {
  try {
    const decoded = jpeg.decode(bytes, {
      useTArray: true,
      formatAsRGBA: false,
      tolerantDecoding: true,
    });
    if (!decoded || !decoded.width || !decoded.height) return null;

    const scale = Math.min(
      1,
      MAX_DECODE_WIDTH / decoded.width,
      MAX_DECODE_HEIGHT / decoded.height,
    );
    const outWidth = Math.max(1, Math.round(decoded.width * scale));
    const outHeight = Math.max(1, Math.round(decoded.height * scale));
    const rgbData = new Uint8Array(outWidth * outHeight * 3);

    for (let y = 0; y < outHeight; y++) {
      const srcY = Math.min(
        decoded.height - 1,
        Math.floor((y / outHeight) * decoded.height),
      );
      for (let x = 0; x < outWidth; x++) {
        const srcX = Math.min(
          decoded.width - 1,
          Math.floor((x / outWidth) * decoded.width),
        );
        const srcIdx = (srcY * decoded.width + srcX) * 3;
        const outIdx = (y * outWidth + x) * 3;
        rgbData[outIdx] = decoded.data[srcIdx];
        rgbData[outIdx + 1] = decoded.data[srcIdx + 1];
        rgbData[outIdx + 2] = decoded.data[srcIdx + 2];
      }
    }

    return { width: outWidth, height: outHeight, data: rgbData };
  } catch {
    return null;
  }
}

// ─── Pixel & Spatial Geometry Analysis Engine ────────────────────────────────
export function analyzeImagePixels(
  data: ArrayLike<number>,
  width: number,
  height: number,
  channels: number = 4,
): FaceCheckResult {
  let totalSkinPixels = 0;
  let sumX = 0;
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 4; y < height - 4; y++) {
    for (let x = 4; x < width - 4; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // RGB Skin tone detector
      const isRgbSkin =
        r > 60 &&
        g > 28 &&
        b > 15 &&
        r > g &&
        r > b &&
        r - g > 6 &&
        Math.max(r, g, b) - Math.min(r, g, b) > 8;

      // YCbCr Skin Tone Detector
      const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
      const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
      const isYCbCrSkin =
        yVal >= 40 &&
        yVal <= 250 &&
        cb >= 75 &&
        cb <= 138 &&
        cr >= 128 &&
        cr <= 182;

      if (isRgbSkin || isYCbCrSkin) {
        totalSkinPixels++;
        sumX += x;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Not enough skin pixels to locate a face — nothing to evaluate for side-look.
  const minRequiredSkin = Math.max(35, Math.floor(width * height * 0.012));
  if (totalSkinPixels < minRequiredSkin) {
    return { faceCount: 0, violation: null };
  }

  const centroidX = sumX / totalSkinPixels;
  const faceBoxWidth = Math.max(maxX - minX, 1);
  const faceBoxHeight = Math.max(maxY - minY, 1);

  // ── SIDE FACE / SIDE LOOK (HEAD YAW) ──────────────────────────────────
  // Partition face horizontally into 3 columns: Left (0-35%), Middle (35-65%), Right (65-100%)
  const col1End = minX + faceBoxWidth * 0.35;
  const col2End = minX + faceBoxWidth * 0.65;
  let leftColSkin = 0;
  let rightColSkin = 0;

  // Measure Dark Facial Features (eyes, nose) centroid vs Skin centroid
  let darkSumX = 0;
  let darkCount = 0;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      const isSkin =
        (r > 60 && g > 28 && b > 15 && r > g && r > b) ||
        (r > 50 && g > 25 && r - g > 6);
      if (isSkin) {
        if (x < col1End) {
          leftColSkin++;
        } else if (x > col2End) {
          rightColSkin++;
        }

        // Dark features in the eye/nose vertical band (upper 20% - 65% of face)
        if (
          y >= minY + faceBoxHeight * 0.2 &&
          y <= minY + faceBoxHeight * 0.65
        ) {
          if (lum < 75 || (r < 75 && g < 75 && b < 75)) {
            darkSumX += x;
            darkCount++;
          }
        }
      }
    }
  }

  // 1. Column Skin Ratio (Left 3rd vs Right 3rd)
  const minCol = Math.min(leftColSkin, rightColSkin);
  const maxCol = Math.max(leftColSkin, rightColSkin);
  const columnRatio = minCol > 0 ? maxCol / minCol : maxCol > 15 ? 2.5 : 1;

  // 2. Dark Feature Horizontal Offset from Skin Center
  let darkFeatureOffset = 0;
  if (darkCount > 8) {
    const darkCenterX = darkSumX / darkCount;
    darkFeatureOffset = Math.abs(darkCenterX - centroidX) / faceBoxWidth;
  }

  const isSideLookColumnRatio = columnRatio > 1.6;
  const isSideLookDarkFeature = darkFeatureOffset > 0.08;

  if (isSideLookColumnRatio || isSideLookDarkFeature) {
    return {
      faceCount: 1,
      violation: SECURITY_VIOLATIONS.SIDE_LOOK,
    };
  }

  return { faceCount: 1, violation: null };
}

// ─── Web ShapeDetection FaceDetector with Landmark & Pose Verification ────────
export async function detectFacesWithShapeDetection(
  videoEl: HTMLVideoElement,
): Promise<FaceCheckResult | null> {
  if (typeof window === "undefined" || !videoEl || videoEl.readyState < 2) {
    return null;
  }

  const FaceDetectorCtor = (
    window as unknown as {
      FaceDetector?: new (options?: {
        fastMode?: boolean;
        maxDetectedFaces?: number;
      }) => {
        detect: (
          source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
        ) => Promise<
          {
            boundingBox?: {
              x: number;
              y: number;
              width: number;
              height: number;
            };
            landmarks?: {
              type: string;
              locations: { x: number; y: number }[];
            }[];
          }[]
        >;
      };
    }
  ).FaceDetector;

  if (!FaceDetectorCtor) return null;

  try {
    const detector = new FaceDetectorCtor({
      fastMode: true,
      maxDetectedFaces: 5,
    });
    const detectedFaces = await detector.detect(videoEl);
    const count = detectedFaces.length;

    if (count !== 1) {
      return { faceCount: count, violation: null };
    }

    const firstFace = detectedFaces[0];
    if (firstFace) {
      // 1. Facial Landmark Yaw Analysis (Eyes & Nose)
      if (firstFace.landmarks && firstFace.landmarks.length > 0) {
        const eyes = firstFace.landmarks.filter((l) => l.type === "eye");
        const nose = firstFace.landmarks.find((l) => l.type === "nose");

        // Profile view where only one eye is detected
        if (eyes.length === 1) {
          return { faceCount: 1, violation: SECURITY_VIOLATIONS.SIDE_LOOK };
        }

        // Two eyes detected: measure Nose Yaw for Side Look
        if (eyes.length >= 2) {
          const sortedEyes = [...eyes].sort(
            (a, b) => (a.locations[0]?.x ?? 0) - (b.locations[0]?.x ?? 0),
          );
          const leftEye = sortedEyes[0].locations[0] ?? { x: 0, y: 0 };
          const rightEye = sortedEyes[1].locations[0] ?? { x: 0, y: 0 };
          const eyeSpan = rightEye.x - leftEye.x;

          // Side Look from nose position
          if (nose?.locations?.[0] && eyeSpan > 8) {
            const noseX = nose.locations[0].x;
            const midEyeX = (leftEye.x + rightEye.x) / 2;
            const noseYaw = Math.abs(noseX - midEyeX) / eyeSpan;
            if (noseYaw > 0.15) {
              return {
                faceCount: 1,
                violation: SECURITY_VIOLATIONS.SIDE_LOOK,
              };
            }
          }
        }
      }

      // 2. Bounding Box Analysis
      if (firstFace.boundingBox) {
        const aspect =
          firstFace.boundingBox.width /
          Math.max(firstFace.boundingBox.height, 1);

        // Side-look: narrowed profile (head turned left/right)
        if (aspect < 0.65) {
          return { faceCount: 1, violation: SECURITY_VIOLATIONS.SIDE_LOOK };
        }
      }
    }

    return { faceCount: 1, violation: null };
  } catch {
    return null;
  }
}

// ─── Web Canvas Image Analyzer Fallback ──────────────────────────────────────
export function detectFacesWithWebCanvas(
  base64: string,
): Promise<FaceCheckResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return resolve({ faceCount: 1, violation: null });
    }

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const width = 120;
          const height = 90;
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return resolve({ faceCount: 1, violation: null });

          ctx.drawImage(img, 0, 0, width, height);
          const imgData = ctx.getImageData(0, 0, width, height);
          const result = analyzeImagePixels(imgData.data, width, height, 4);
          resolve(result);
        } catch {
          resolve({ faceCount: 1, violation: null });
        }
      };
      img.onerror = () => resolve({ faceCount: 1, violation: null });
      img.src = base64.startsWith("data:")
        ? base64
        : `data:image/jpeg;base64,${base64}`;
    } catch {
      resolve({ faceCount: 1, violation: null });
    }
  });
}
