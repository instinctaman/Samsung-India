import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { checkFrameForFaces } from "@/api/proctoring";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

import {
  MAX_PROCTORING_WARNINGS,
  SECURITY_VIOLATIONS,
  SecurityViolationType,
  VIOLATION_FOOTER_LABELS,
} from "./violations";

const CHECK_INTERVAL_MS = 400;
// Give the candidate a moment to settle into frame before checks start —
// otherwise the very first capture (face still off-center/out of view) fires
// a false violation the instant the camera turns on.
const GRACE_PERIOD_MS = 500 ;

type Props = {
  token: string | null;
  active: boolean;
  paused?: boolean;
  warningsCount?: number;
  latestViolation?: SecurityViolationType | null;
  /** Called with the violation type when any violation fires */
  onViolation?: (violationType: SecurityViolationType) => void;
  /** Legacy callback when max warnings reached */
  onMaxWarnings?: () => void;
};

export default function ProctoringPanel({
  token,
  active,
  paused = false,
  warningsCount = 0,
  latestViolation = null,
  onViolation,
  onMaxWarnings,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const isChecking = useRef(false);

  // Guard flag: triggers exactly ONE violation per continuous event until problem clears
  const hasTriggeredCurrentRef = useRef<boolean>(false);

  const [activeCandidateBadge, setActiveCandidateBadge] =
    useState<SecurityViolationType | null>(null);

  // Captures feed a lightweight heuristic (downsampled to ~120x90 anyway), so
  // ask the hardware for its smallest supported size — decoding a full-res
  // photo every 700ms would otherwise stall the JS thread.
  const [pictureSize, setPictureSize] = useState<string | undefined>(
    undefined,
  );

  // Timestamp the camera actually came alive, so checks can wait out
  // GRACE_PERIOD_MS from that moment rather than from component mount.
  const cameraReadyAtRef = useRef<number | null>(null);
  const [inGracePeriod, setInGracePeriod] = useState(true);

  const handleCameraReady = useCallback(() => {
    if (!cameraReadyAtRef.current) {
      cameraReadyAtRef.current = Date.now();
    }
    if (pictureSize || !cameraRef.current) return;
    cameraRef.current
      .getAvailablePictureSizesAsync()
      .then((sizes) => {
        if (sizes.length === 0) return;
        const smallest = sizes.reduce((best, size) => {
          const [w, h] = size.split("x").map(Number);
          const [bw, bh] = best.split("x").map(Number);
          return w * h < bw * bh ? size : best;
        });
        setPictureSize(smallest);
      })
      .catch(() => {
        // Keep the hardware default if sizes can't be fetched
      });
  }, [pictureSize]);

  const maxedOut = warningsCount >= MAX_PROCTORING_WARNINGS;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!active || paused || !permission?.granted || !token || maxedOut) {
      hasTriggeredCurrentRef.current = false;
      return;
    }

    const interval = setInterval(async () => {
      if (isChecking.current || !cameraRef.current || paused || maxedOut) {
        return;
      }

      const readyAt = cameraReadyAtRef.current;
      if (!readyAt || Date.now() - readyAt < GRACE_PERIOD_MS) {
        setInGracePeriod(true);
        return;
      }
      setInGracePeriod(false);

      isChecking.current = true;

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          base64: true,
          // skipProcessing MUST be false on Android — when true, the hardware
          // encoder may not finish writing the base64 payload, causing silent
          // failures where photo.base64 is undefined or empty.
          skipProcessing: false,
          // Background proctoring captures fire every 700ms — without this the
          // device's shutter sound/click plays continuously through the test.
          shutterSound: false,
        });

        // On some Android builds (Samsung, Pixel), photo.base64 is undefined
        // even with base64:true. Fall back to reading the file directly.
        let frameBase64: string | undefined = photo?.base64;
        if (!frameBase64 && photo?.uri && Platform.OS !== "web") {
          try {
            frameBase64 = await FileSystem.readAsStringAsync(photo.uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
          } catch {
            // File unreadable — skip this frame
          }
        }

        if (frameBase64) {
          const result = await checkFrameForFaces(token, frameBase64);

          // Only the side-look (left/right head turn) violation is surfaced.
          const currentFrameViolation: SecurityViolationType | null =
            result.violation === SECURITY_VIOLATIONS.SIDE_LOOK
              ? result.violation
              : null;

          // ── Immediate Violation Trigger ──────────────────────────────────
          if (currentFrameViolation) {
            setActiveCandidateBadge(currentFrameViolation);

            if (!hasTriggeredCurrentRef.current) {
              // Fire on the very first frame the violation is seen on.
              hasTriggeredCurrentRef.current = true;
              onViolation?.(currentFrameViolation);
              if (warningsCount + 1 >= MAX_PROCTORING_WARNINGS) {
                onMaxWarnings?.();
              }
            }
          } else {
            // Problem cleared: reset guard so the next occurrence retriggers.
            hasTriggeredCurrentRef.current = false;
            setActiveCandidateBadge(null);
          }
        }
      } catch {
        // Camera busy or frame error ignored
      } finally {
        isChecking.current = false;
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      hasTriggeredCurrentRef.current = false;
      setActiveCandidateBadge(null);
    };
  }, [
    active,
    paused,
    permission,
    token,
    maxedOut,
    warningsCount,
    onViolation,
    onMaxWarnings,
  ]);

  const isInactive =
    !active || paused || !permission?.granted || !token || maxedOut;
  const currentBadge = isInactive ? null : activeCandidateBadge;

  const footerLabel = !permission?.granted
    ? "Camera Off"
    : maxedOut
      ? "Submitting…"
      : currentBadge
        ? VIOLATION_FOOTER_LABELS[currentBadge] || "VIOLATION\nDETECTED"
        : inGracePeriod
          ? "Get Ready…"
          : "AI Active";

  const isDangerBadge = !!currentBadge || maxedOut;

  const footerIcon = !permission?.granted
    ? "videocam-off-outline"
    : isDangerBadge
      ? "alert-circle"
      : "shield-checkmark-outline";

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Ionicons
          name="shield-checkmark-outline"
          size={11}
          color={Colors.white}
        />
        <AppText style={styles.headerText} weight={FontWeight.medium}>
          AI PROCTORING
        </AppText>
      </View>

      <View style={styles.cameraArea}>
        {!permission ? (
          <ActivityIndicator color={Colors.white} />
        ) : !permission.granted ? (
          <View style={styles.permissionPrompt}>
            <Ionicons name="camera-outline" size={22} color={Colors.white} />
            <AppText style={styles.permissionText}>
              Camera access is required for this proctored test.
            </AppText>
            <Pressable
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <AppText
                style={styles.permissionButtonText}
                weight={FontWeight.semiBold}
              >
                Enable Camera
              </AppText>
            </Pressable>
          </View>
        ) : (
          <>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
              mirror
              pictureSize={pictureSize}
              onCameraReady={handleCameraReady}
              // Background proctoring captures fire every 700ms — without this
              // the screen visibly flashes on every silent capture.
              animateShutter={false}
            />
            <View
              style={[
                styles.footer,
                isDangerBadge && styles.footerDanger,
                !isDangerBadge && warningsCount > 0 && styles.footerWarning,
              ]}
            >
              <Ionicons name={footerIcon} size={12} color={Colors.white} />
              <AppText
                style={styles.footerText}
                weight={FontWeight.bold}
                numberOfLines={2}
              >
                {footerLabel}
              </AppText>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "92%",
    maxWidth: 142,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#00A859",
    overflow: "hidden",
    backgroundColor: "#111827",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
    backgroundColor: "#374151",
  },
  headerText: {
    color: Colors.white,
    fontSize: 9,
    letterSpacing: 0.5,
    alignSelf: "center",
  },
  cameraArea: {
    height: 86,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  camera: { width: "100%", height: "100%" },

  permissionPrompt: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
  },
  permissionText: {
    color: Colors.white,
    fontSize: Fonts.overline,
    textAlign: "center",
  },
  permissionButton: {
    marginTop: 2,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  permissionButtonText: { color: Colors.white, fontSize: Fonts.overline },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: Colors.success,
    flexWrap: "wrap",
  },
  footerWarning: { backgroundColor: "#F59E0B" },
  footerDanger: { backgroundColor: "#DC2626" },
  footerText: {
    color: Colors.white,
    fontSize: 9.5,
    textAlign: "center",
    lineHeight: 12,
  },
});
