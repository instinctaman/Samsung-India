import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { checkFrameForFaces } from "@/api/proctoring";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

import SecurityViolationModal from "./SecurityViolationModal";
import {
  MAX_PROCTORING_WARNINGS,
  SECURITY_VIOLATIONS,
  SecurityViolationType,
  VIOLATION_FOOTER_LABELS,
} from "./violations";

const CHECK_INTERVAL_MS = 6000;

// Cycles through all violation types in demo mode so every type is demonstrable.
const DEMO_VIOLATION_CYCLE: SecurityViolationType[] = [
  SECURITY_VIOLATIONS.MULTIPLE_PEOPLE,
  SECURITY_VIOLATIONS.NO_FACE,
  SECURITY_VIOLATIONS.HEAD_TILT,
  SECURITY_VIOLATIONS.SIDE_LOOK,
  SECURITY_VIOLATIONS.MULTIPLE_PEOPLE,
];

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

  const maxedOut = warningsCount >= MAX_PROCTORING_WARNINGS;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!active || paused || !permission?.granted || !token || maxedOut) return;

    const interval = setInterval(async () => {
      if (isChecking.current || !cameraRef.current || paused || maxedOut) return;
      isChecking.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.3,
          base64: true,
          skipProcessing: true,
        });
        if (photo?.base64) {
          const result = await checkFrameForFaces(token, photo.base64);

          let detectedViolation: SecurityViolationType | null = null;
          if (result.violation) {
            detectedViolation = result.violation;
          } else if (result.faceCount === 0) {
            detectedViolation = SECURITY_VIOLATIONS.NO_FACE;
          } else if (result.faceCount > 1) {
            detectedViolation = SECURITY_VIOLATIONS.MULTIPLE_PEOPLE;
          }

          if (detectedViolation) {
            onViolation?.(detectedViolation);
            if (warningsCount + 1 >= MAX_PROCTORING_WARNINGS) {
              onMaxWarnings?.();
            }
          }
        }
      } catch {
        // Network hiccups or a busy camera shouldn't penalize the trainee.
      } finally {
        isChecking.current = false;
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [active, paused, permission, token, maxedOut, warningsCount, onViolation, onMaxWarnings]);

  const footerLabel = !permission?.granted
    ? "Camera Off"
    : maxedOut
      ? "Submitting…"
      : latestViolation
        ? VIOLATION_FOOTER_LABELS[latestViolation] || `Warning ${warningsCount}/${MAX_PROCTORING_WARNINGS}`
        : warningsCount > 0
          ? `Warning ${warningsCount}/${MAX_PROCTORING_WARNINGS}`
          : "AI Active";

  const footerIcon = !permission?.granted
    ? "videocam-off-outline"
    : warningsCount > 0
      ? "warning-outline"
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
          warningsCount > 0 && !maxedOut && styles.footerWarning,
          maxedOut && styles.footerDanger,
        ]}
      >
        <Ionicons name={footerIcon} size={12} color={Colors.white} />
        <AppText
          style={styles.footerText}
          weight={FontWeight.medium}
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
  footerDanger: { backgroundColor: Colors.danger },
  footerText: { color: Colors.white, fontSize: 10, textAlign: "center" },
});
