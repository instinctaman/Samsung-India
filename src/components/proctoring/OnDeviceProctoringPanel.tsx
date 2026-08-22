import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useFaceDetectorOutput } from "react-native-vision-camera-face-detector";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { ProctoringEngine } from "@/proctoring/onDevice/ProctoringEngine";
import { MIN_FACE_SIZE } from "@/proctoring/onDevice/config";
import type { DetectedEventType, DetectionEvent } from "@/proctoring/onDevice/types";

import {
  MAX_PROCTORING_WARNINGS,
  SECURITY_VIOLATIONS,
  SecurityViolationType,
  VIOLATION_FOOTER_LABELS,
} from "./violations";

/**
 * On-device replacement for ProctoringPanel: same props, same visual layout
 * (header/camera-area/footer badge — literally the same style rules below),
 * but detection runs locally via react-native-vision-camera + ML Kit instead
 * of snapshotting a JPEG every 500ms to the checkFrameForFaces backend
 * endpoint. See the "onDevice" module for the detection engine itself.
 */

const EVENT_TO_VIOLATION: Record<DetectedEventType, SecurityViolationType> = {
  NO_FACE: SECURITY_VIOLATIONS.NO_FACE,
  MULTIPLE_FACES: SECURITY_VIOLATIONS.MULTIPLE_PEOPLE,
  LOOKING_LEFT: SECURITY_VIOLATIONS.SIDE_LOOK,
  LOOKING_RIGHT: SECURITY_VIOLATIONS.SIDE_LOOK,
  HEAD_TILT: SECURITY_VIOLATIONS.HEAD_TILT,
};

type Props = {
  token: string | null;
  active: boolean;
  paused?: boolean;
  warningsCount?: number;
  latestViolation?: SecurityViolationType | null;
  /** Called with the violation type when any violation fires */
  onViolation?: (violationType: SecurityViolationType) => void;
  /** Called with the violation type on the earlier, non-strike WARNING tier */
  onWarning?: (violationType: SecurityViolationType) => void;
  /** Legacy callback when max warnings reached */
  onMaxWarnings?: () => void;
};

export default function OnDeviceProctoringPanel({
  active,
  paused = false,
  warningsCount = 0,
  onViolation,
  onWarning,
}: Props) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("front");

  const [engine] = useState(() => new ProctoringEngine());

  const [activeCandidateBadge, setActiveCandidateBadge] = useState<SecurityViolationType | null>(null);
  const [graceActive, setGraceActive] = useState(true);
  const wasPausedRef = useRef(paused);
  const wasActiveRef = useRef(active);

  const maxedOut = warningsCount >= MAX_PROCTORING_WARNINGS;

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // Fresh grace period each time proctoring (re)starts.
  useEffect(() => {
    if (active && !wasActiveRef.current) engine.reset();
    wasActiveRef.current = active;
  }, [active, engine]);

  // Resuming from a pause (the violation modal just closed) — re-check
  // whatever's still ongoing instead of waiting for it to naturally end.
  useEffect(() => {
    if (wasPausedRef.current && !paused) engine.rearmAll();
    wasPausedRef.current = paused;
  }, [paused, engine]);

  useEffect(() => {
    const unsubscribeLive = engine.onLiveState((state) => {
      setGraceActive(state.graceActive);
      if (state.face === "NO_FACE") setActiveCandidateBadge(SECURITY_VIOLATIONS.NO_FACE);
      else if (state.face === "MULTIPLE_FACES") setActiveCandidateBadge(SECURITY_VIOLATIONS.MULTIPLE_PEOPLE);
      else if (state.head === "LEFT" || state.head === "RIGHT") setActiveCandidateBadge(SECURITY_VIOLATIONS.SIDE_LOOK);
      else if (state.head === "TILT") setActiveCandidateBadge(SECURITY_VIOLATIONS.HEAD_TILT);
      else setActiveCandidateBadge(null);
    });
    const unsubscribeEvent = engine.onEvent((event: DetectionEvent) => {
      const violationType = EVENT_TO_VIOLATION[event.eventType];
      if (event.severity === "VIOLATION") onViolation?.(violationType);
      else if (event.severity === "WARNING") onWarning?.(violationType);
    });
    return () => {
      unsubscribeLive();
      unsubscribeEvent();
    };
  }, [engine, onViolation, onWarning]);

  const faceDetectorOutput = useFaceDetectorOutput({
    performanceMode: "fast",
    runLandmarks: false,
    runContours: false,
    runClassifications: false,
    trackingEnabled: false,
    minFaceSize: MIN_FACE_SIZE,
    onFacesDetected(faces) {
      if (!active || paused || maxedOut) return;

      if (faces.length === 0) {
        engine.ingestFace({ faceCount: 0 }, Date.now());
        return;
      }

      // Largest face by area is treated as the primary candidate (the exam taker).
      let primary = faces[0]!;
      let primaryArea = primary.bounds.width * primary.bounds.height;
      for (let i = 1; i < faces.length; i++) {
        const f = faces[i]!;
        const area = f.bounds.width * f.bounds.height;
        if (area > primaryArea) {
          primary = f;
          primaryArea = area;
        }
      }

      engine.ingestFace(
        {
          faceCount: faces.length,
          primaryFace: { yawDeg: primary.yawAngle, pitchDeg: primary.pitchAngle, rollDeg: primary.rollAngle },
        },
        Date.now()
      );
    },
    onError(error) {
      console.warn("OnDeviceProctoringPanel: face detector error, skipping frame.", error);
    },
  });

  const isInactive = !active || paused || !hasPermission || maxedOut;
  const currentBadge = isInactive ? null : activeCandidateBadge;

  const footerLabel = !hasPermission
    ? "Camera Off"
    : maxedOut
      ? "Submitting…"
      : currentBadge
        ? VIOLATION_FOOTER_LABELS[currentBadge] || "VIOLATION\nDETECTED"
        : graceActive
          ? "Get Ready…"
          : "AI Active";

  const isDangerBadge = !!currentBadge || maxedOut;

  const footerIcon = !hasPermission
    ? "videocam-off-outline"
    : isDangerBadge
      ? "alert-circle"
      : "shield-checkmark-outline";

  return (
    <View style={[styles.panel, isDangerBadge && styles.panelDanger]}>
      <View style={[styles.header, isDangerBadge && styles.headerDanger]}>
        <Ionicons
          name={isDangerBadge ? "alert-circle" : "shield-checkmark-outline"}
          size={11}
          color={Colors.white}
        />
        <AppText style={styles.headerText} weight={FontWeight.medium}>
          AI PROCTORING
        </AppText>
      </View>

      <View style={styles.cameraArea}>
        {!hasPermission ? (
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
        ) : !device ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Camera
              style={styles.camera}
              device={device}
              isActive={active}
              outputs={[faceDetectorOutput]}
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
  panelDanger: { borderColor: "#DC2626" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
    backgroundColor: "#374151",
  },
  headerDanger: { backgroundColor: "#DC2626" },
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
