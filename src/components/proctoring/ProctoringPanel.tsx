import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
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

// 700ms interval reliably takes 3 samples within the 2-second continuous window
const CHECK_INTERVAL_MS = 700;
const CONTINUOUS_VIOLATION_THRESHOLD_MS = 2000;

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

  // Tracks candidate violation currently observed in camera
  const candidateViolationRef = useRef<SecurityViolationType | null>(null);
  // Timestamp when candidate violation started continuously
  const candidateStartTimeRef = useRef<number | null>(null);
  // Guard flag: triggers exactly ONE violation per continuous event until problem clears
  const hasTriggeredCurrentRef = useRef<boolean>(false);

  const [activeCandidateBadge, setActiveCandidateBadge] =
    useState<SecurityViolationType | null>(null);

  const maxedOut = warningsCount >= MAX_PROCTORING_WARNINGS;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!active || paused || !permission?.granted || !token || maxedOut) {
      candidateViolationRef.current = null;
      candidateStartTimeRef.current = null;
      hasTriggeredCurrentRef.current = false;
      return;
    }

    const interval = setInterval(async () => {
      if (isChecking.current || !cameraRef.current || paused || maxedOut) {
        return;
      }
      isChecking.current = true;

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          base64: true,
          // skipProcessing MUST be false on Android — when true, the hardware
          // encoder may not finish writing the base64 payload, causing silent
          // failures where photo.base64 is undefined or empty.
          skipProcessing: false,
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
          const faceCount = result.faceCount ?? 1;

          // Determine current frame violation (if any)
          let currentFrameViolation: SecurityViolationType | null = null;
          if (faceCount > 1) {
            currentFrameViolation = SECURITY_VIOLATIONS.MULTIPLE_PEOPLE;
          } else if (faceCount === 0) {
            currentFrameViolation = SECURITY_VIOLATIONS.NO_FACE;
          } else if (result.violation) {
            currentFrameViolation = result.violation;
          }

          // ── Continuous 2-Second Verification Logic ─────────────────────────
          if (currentFrameViolation) {
            setActiveCandidateBadge(currentFrameViolation);
            const now = Date.now();

            if (!candidateStartTimeRef.current) {
              // Violation candidate started
              candidateViolationRef.current = currentFrameViolation;
              candidateStartTimeRef.current = now;
              hasTriggeredCurrentRef.current = false;
            } else {
              // Update to most recent violation type
              candidateViolationRef.current = currentFrameViolation;
              if (
                !hasTriggeredCurrentRef.current &&
                now - candidateStartTimeRef.current >=
                  CONTINUOUS_VIOLATION_THRESHOLD_MS
              ) {
                // Violation persisted continuously for ≥ 2000ms:
                hasTriggeredCurrentRef.current = true;
                onViolation?.(currentFrameViolation);
                if (warningsCount + 1 >= MAX_PROCTORING_WARNINGS) {
                  onMaxWarnings?.();
                }
              }
            }
          } else {
            // Problem cleared: reset candidate tracking
            candidateViolationRef.current = null;
            candidateStartTimeRef.current = null;
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
      candidateViolationRef.current = null;
      candidateStartTimeRef.current = null;
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

  const isInactive = !active || paused || !permission?.granted || !token || maxedOut;
  const currentBadge = isInactive ? null : activeCandidateBadge;

  const footerLabel = !permission?.granted
    ? "Camera Off"
    : maxedOut
      ? "Submitting…"
      : currentBadge
        ? VIOLATION_FOOTER_LABELS[currentBadge] || "VIOLATION\nDETECTED"
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
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            mirror
          />
        )}
      </View>

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
