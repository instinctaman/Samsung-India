import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import AppModal from "@/components/ui/AppModal";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { checkFrameForFaces } from "@/api/proctoring";

const CHECK_INTERVAL_MS = 6000;
const MAX_WARNINGS = 3;

type Props = {
  token: string | null;
  active: boolean;
  onMaxWarnings: () => void;
};

export default function ProctoringPanel({ token, active, onMaxWarnings }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const isChecking = useRef(false);

  const [warnings, setWarnings] = useState(0);
  const [warningVisible, setWarningVisible] = useState(false);

  const maxedOut = warnings >= MAX_WARNINGS;

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!active || !permission?.granted || !token || warningVisible || maxedOut) return;

    const interval = setInterval(async () => {
      if (isChecking.current || !cameraRef.current) return;
      isChecking.current = true;
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.3, base64: true, skipProcessing: true });
        if (photo?.base64) {
          const result = await checkFrameForFaces(token, photo.base64);
          if (result.faceCount > 1) setWarnings((count) => Math.min(count + 1, MAX_WARNINGS));
        }
      } catch {
        // Network hiccups or a busy camera shouldn't penalize the trainee.
      } finally {
        isChecking.current = false;
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [active, permission, token, warningVisible, maxedOut]);

  useEffect(() => {
    if (warnings === 0) return;
    setWarningVisible(true);
    if (warnings >= MAX_WARNINGS) {
      const timer = setTimeout(() => {
        setWarningVisible(false);
        onMaxWarnings();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [warnings]);

  const dismissWarning = () => {
    if (maxedOut) return;
    setWarningVisible(false);
  };

  const footerLabel = !permission?.granted
    ? "Camera Off"
    : maxedOut
    ? "Submitting…"
    : warnings > 0
    ? `Warning ${warnings}/${MAX_WARNINGS}`
    : "AI Active";

  const footerIcon = !permission?.granted ? "videocam-off-outline" : warnings > 0 ? "warning-outline" : "shield-checkmark-outline";

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark-outline" size={11} color={Colors.white} />
        <AppText style={styles.headerText} weight={FontWeight.medium}>AI PROCTORING</AppText>
      </View>

      <View style={styles.cameraArea}>
        {!permission ? (
          <ActivityIndicator color={Colors.white} />
        ) : !permission.granted ? (
          <View style={styles.permissionPrompt}>
            <Ionicons name="camera-outline" size={22} color={Colors.white} />
            <AppText style={styles.permissionText}>Camera access is required for this proctored test.</AppText>
            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <AppText style={styles.permissionButtonText} weight={FontWeight.semiBold}>Enable Camera</AppText>
            </Pressable>
          </View>
        ) : (
          <CameraView ref={cameraRef} style={styles.camera} facing="front" mirror />
        )}
      </View>

      <View style={[styles.footer, warnings > 0 && !maxedOut && styles.footerWarning, maxedOut && styles.footerDanger]}>
        <Ionicons name={footerIcon} size={12} color={Colors.white} />
        <AppText style={styles.footerText} weight={FontWeight.medium}>{footerLabel}</AppText>
      </View>

      <AppModal
        visible={warningVisible}
        onClose={dismissWarning}
        position="center"
        title={maxedOut ? "Test Submitting" : "Proctoring Warning"}
        closeOnOverlayPress={!maxedOut}
      >
        <View style={styles.modalBody}>
          <Ionicons name="alert-circle" size={40} color={maxedOut ? Colors.danger : "#F59E0B"} />
          <AppText style={styles.modalMessage}>
            {maxedOut
              ? "Maximum warnings reached. Your test is being submitted automatically."
              : `Multiple people were detected in the camera frame. This is warning ${warnings} of ${MAX_WARNINGS}. Reaching ${MAX_WARNINGS} warnings will auto-submit your test.`}
          </AppText>
          {!maxedOut && (
            <Pressable style={styles.modalButton} onPress={dismissWarning}>
              <AppText color={Colors.white} weight={FontWeight.semiBold}>I Understand</AppText>
            </Pressable>
          )}
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: 10, overflow: "hidden", backgroundColor: "#111827" },
  header: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, backgroundColor: "#374151" },
  headerText: { color: Colors.white, fontSize: 9, letterSpacing: 0.5, alignSelf: "center" },
  cameraArea: { height: 130, backgroundColor: "#1F2937", alignItems: "center", justifyContent: "center" },
  camera: { width: "100%", height: "100%" },
  permissionPrompt: { alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 12 },
  permissionText: { color: Colors.white, fontSize: Fonts.overline, textAlign: "center" },
  permissionButton: { marginTop: 2, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  permissionButtonText: { color: Colors.white, fontSize: Fonts.overline },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingVertical: 5, backgroundColor: Colors.success },
  footerWarning: { backgroundColor: "#F59E0B" },
  footerDanger: { backgroundColor: Colors.danger },
  footerText: { color: Colors.white, fontSize: 10 },
  modalBody: { alignItems: "center", gap: 10, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 4 },
  modalMessage: { textAlign: "center", fontSize: Fonts.bodySm, color: Colors.gray600, lineHeight: 19 },
  modalButton: { marginTop: 4, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
});
