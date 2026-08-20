import { useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, endTraining } from "@/api/training";

export default function SecureCheckoutScreen() {
  const router = useRouter();
  const { adminToken } = useAuth();
  const params = useLocalSearchParams<{ conferenceUid: string }>();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!permission?.granted) requestPermission();

  const handleCapture = async () => {
    if (!cameraRef.current || !cameraReady) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.4, exif: false });
      if (photo?.uri) setPhotoUri(photo.uri);
    } catch {
      setError("Couldn't capture the photo. Please try again.");
    }
  };

  const handlePickSheet = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.[0]) {
      setSheetName(result.assets[0].name);
    }
  };

  const handleSubmit = async () => {
    if (!adminToken || !params.conferenceUid) return;
    setSubmitting(true);
    setError(null);
    try {
      await endTraining(adminToken, params.conferenceUid);
      router.replace("/trainer_dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't end the session. Please try again.");
      setSubmitting(false);
    }
  };

  const canSubmit = !!photoUri && !!sheetName && !submitting;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <AppText style={styles.title} weight={FontWeight.semiBold}>Security Check-Out</AppText>
        <AppText style={styles.subtitle} color={Colors.gray600}>
          Please capture a clear photo of your face to verify your identity.
        </AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.photoBox}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : permission?.granted ? (
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
              onCameraReady={() => setCameraReady(true)}
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={48} color={Colors.gray400} />
            </View>
          )}
        </View>

        <Pressable style={styles.captureButton} onPress={handleCapture}>
          <Ionicons name="camera" size={18} color={Colors.white} />
          <AppText color={Colors.white} weight={FontWeight.medium}>Capture Photo</AppText>
        </Pressable>

        {photoUri && (
          <View style={styles.sheetRow}>
            <Pressable style={styles.sheetField} onPress={handlePickSheet}>
              <Ionicons name="document-text-outline" size={16} color={Colors.gray600} />
              <AppText style={styles.sheetFieldText} color={sheetName ? Colors.black : Colors.gray400} numberOfLines={1}>
                {sheetName ?? "Upload attendance sheet"}
              </AppText>
            </Pressable>
            <Pressable
              style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <AppText color={Colors.white} weight={FontWeight.medium}>Submit</AppText>
              )}
            </Pressable>
          </View>
        )}

        {error && <AppText style={styles.error}>{error}</AppText>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { alignItems: "center", paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  title: { fontSize: Fonts.h2 },
  subtitle: { marginTop: 6, fontSize: Fonts.bodySm, textAlign: "center", lineHeight: 19 },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  photoBox: {
    marginTop: 16, height: 300, borderRadius: Radius.xxl, overflow: "hidden",
    backgroundColor: Colors.gray100, alignItems: "center", justifyContent: "center",
  },
  photoPlaceholder: { alignItems: "center", justifyContent: "center" },
  camera: { width: "100%", height: "100%" },
  photoPreview: { width: "100%", height: "100%" },

  captureButton: {
    marginTop: 16, height: 50, borderRadius: Radius.xl, backgroundColor: Colors.mainColour1,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },

  sheetRow: { marginTop: 12, flexDirection: "row", gap: 10 },
  sheetField: {
    flex: 1, height: 48, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.gray200,
    backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14,
  },
  sheetFieldText: { flex: 1, fontSize: Fonts.xs },
  submitButton: {
    width: 96, height: 48, borderRadius: Radius.xl, backgroundColor: Colors.success,
    alignItems: "center", justifyContent: "center",
  },
  submitButtonDisabled: { opacity: 0.5 },

  error: { marginTop: 12, fontSize: Fonts.bodySm, color: Colors.danger, textAlign: "center" },
});
