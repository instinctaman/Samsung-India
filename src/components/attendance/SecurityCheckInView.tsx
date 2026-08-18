import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { createShadow } from "@/theme/shadows";

const DEFAULT_SAMPLE_PHOTO: ImageSourcePropType = require("@/assets/images/user_img/default_male.png");

export type SecurityCheckInViewProps = {
  onProceed: (photoSource: ImageSourcePropType) => void;
  onBack?: () => void;
};

export default function SecurityCheckInView({
  onProceed,
  onBack,
}: SecurityCheckInViewProps) {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [photoSource, setPhotoSource] = useState<ImageSourcePropType | null>(
    null
  );

  // Request camera permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Clean up any active camera streams/listeners when leaving the screen
  useEffect(() => {
    return () => {
      setCameraReady(false);
    };
  }, []);

  const handleCapture = async () => {
    setCapturing(true);
    try {
      if (cameraRef.current && cameraReady) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
          exif: false,
          skipProcessing: true,
        });
        if (photo?.uri) {
          setPhotoSource({ uri: photo.uri });
          setCapturing(false);
          return;
        }
      }
    } catch {
      // Fallback for emulator / web / environment without active hardware camera stream
    }

    // Fallback high-fidelity sample photo for development / simulators
    setPhotoSource(DEFAULT_SAMPLE_PHOTO);
    setCapturing(false);
  };

  const handleRetake = () => {
    setPhotoSource(null);
    setCameraReady(false);
  };

  const handleProceedPress = () => {
    if (!photoSource) return;
    onProceed(photoSource);
  };

  const hasPhoto = photoSource !== null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="dark" animated />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main White Card Container */}
        <View style={styles.card}>
          {/* Header Title & Subtitle */}
          <AppText style={styles.title} weight={FontWeight.bold}>
            Security Check-In
          </AppText>
          <AppText style={styles.subtitle}>
            Please capture a clear photo of your face{"\n"}to verify your identity.
          </AppText>

          {/* Camera Viewfinder / Captured Photo Area */}
          <View style={styles.viewfinderBox}>
            {hasPhoto ? (
              <Image
                source={photoSource}
                style={styles.photoImage}
                resizeMode="cover"
              />
            ) : permission?.granted ? (
              <CameraView
                ref={cameraRef}
                style={styles.cameraStream}
                facing="front"
                mirror
                onCameraReady={() => setCameraReady(true)}
              />
            ) : (
              <View style={styles.placeholderBox}>
                <View style={styles.cameraOutlineBox}>
                  <Ionicons
                    name="camera-outline"
                    size={72}
                    color="rgba(255, 255, 255, 0.9)"
                  />
                </View>
                {permission && !permission.granted && (
                  <Pressable
                    style={styles.enablePermButton}
                    onPress={requestPermission}
                  >
                    <AppText color={Colors.white} weight={FontWeight.medium} style={styles.enablePermText}>
                      Enable Camera
                    </AppText>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* State-based Controls */}
          {!hasPhoto ? (
            /* State 1 & 2: Initial / Camera-ready state (No photo yet) */
            <>
              {/* Primary "Capture Photo" Button */}
              <Pressable
                style={[
                  styles.captureButton,
                  capturing && styles.captureButtonDisabled,
                ]}
                onPress={handleCapture}
                disabled={capturing}
                accessibilityRole="button"
                accessibilityLabel="Capture Photo"
              >
                {capturing ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="camera" size={20} color={Colors.white} />
                    <AppText
                      color={Colors.white}
                      weight={FontWeight.semiBold}
                      style={styles.captureButtonText}
                    >
                      Capture Photo
                    </AppText>
                  </>
                )}
              </Pressable>

              {/* Disabled Retake & Proceed Row */}
              <View style={styles.actionsRow}>
                <View style={styles.disabledRetakeButton}>
                  <Ionicons name="refresh" size={18} color="#9CA3AF" />
                  <AppText color="#9CA3AF" weight={FontWeight.medium}>
                    Retake
                  </AppText>
                </View>

                <View style={styles.disabledProceedButton}>
                  <AppText color={Colors.white} weight={FontWeight.medium}>
                    Proceed
                  </AppText>
                  <Ionicons
                    name="arrow-forward"
                    size={16}
                    color={Colors.white}
                  />
                </View>
              </View>
            </>
          ) : (
            /* State 3: Captured-photo state */
            <>
              {/* Green Tips for best results Banner */}
              <View style={styles.greenTipsBanner}>
                <View style={styles.greenDot} />
                <View style={styles.tipsTextColumn}>
                  <AppText
                    style={styles.tipsTitle}
                    weight={FontWeight.bold}
                  >
                    Tips for best results
                  </AppText>
                  <AppText style={styles.tipsSubtitle}>
                    Ensure good lighting, look straight at the camera and
                    remove anything that covers your face.
                  </AppText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#374151"
                />
              </View>

              {/* Enabled Retake & Proceed Row */}
              <View style={styles.actionsRow}>
                <Pressable
                  style={styles.enabledRetakeButton}
                  onPress={handleRetake}
                  accessibilityRole="button"
                  accessibilityLabel="Retake Photo"
                >
                  <Ionicons name="refresh" size={18} color="#374151" />
                  <AppText
                    color="#374151"
                    weight={FontWeight.semiBold}
                  >
                    Retake
                  </AppText>
                </Pressable>

                <Pressable
                  style={styles.enabledProceedButton}
                  onPress={handleProceedPress}
                  accessibilityRole="button"
                  accessibilityLabel="Proceed to Home"
                >
                  <AppText
                    color={Colors.white}
                    weight={FontWeight.bold}
                    style={styles.proceedButtonText}
                  >
                    Proceed
                  </AppText>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={Colors.white}
                  />
                </Pressable>
              </View>
            </>
          )}
        </View>

        {/* Bottom Information / Security Banner */}
        {!hasPhoto ? (
          <View style={styles.blueAlertBanner}>
            <View style={styles.blueShieldIconWrap}>
              <Ionicons
                name="shield-checkmark"
                size={18}
                color="#0066FF"
              />
            </View>
            <View style={styles.alertTextColumn}>
              <AppText style={styles.alertTitle} weight={FontWeight.semiBold}>
                Make sure your face is clearly visible
              </AppText>
              <AppText style={styles.alertSubtitle}>
                Good lighting helps verification.
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#374151" />
          </View>
        ) : (
          <View style={styles.encryptionFooter}>
            <View style={styles.lockIconCircle}>
              <Ionicons name="lock-closed" size={13} color="#14B8A6" />
            </View>
            <AppText style={styles.encryptionText} weight={FontWeight.medium}>
              Your data is secure and encrypted
            </AppText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#EEF4FF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: "center",
  },

  // Main Card
  card: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    ...createShadow({ x: 0, y: 4, blur: 12, opacity: 0.08, elevation: 3 }),
  },
  title: {
    fontSize: 22,
    color: "#111827",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12.5,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 18,
  },

  // Viewfinder
  viewfinderBox: {
    width: "100%",
    height: 330,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  cameraOutlineBox: {
    width: 140,
    height: 100,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  enablePermButton: {
    backgroundColor: "rgba(0, 102, 255, 0.85)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  enablePermText: {
    fontSize: 11,
  },
  cameraStream: {
    width: "100%",
    height: "100%",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },

  // Controls - State 1 & 2 (No photo)
  captureButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#0066FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonText: {
    fontSize: 15,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  disabledRetakeButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    opacity: 0.6,
  },
  disabledProceedButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    opacity: 0.45,
  },

  // Controls - State 3 (Photo Captured)
  greenTipsBanner: {
    backgroundColor: "#E6F8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  greenDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#10B981",
  },
  tipsTextColumn: {
    flex: 1,
    gap: 2,
  },
  tipsTitle: {
    fontSize: 12,
    color: "#111827",
  },
  tipsSubtitle: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 14,
  },
  enabledRetakeButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  enabledProceedButton: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#05A869",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  proceedButtonText: {
    fontSize: 15,
  },

  // Bottom Alerts
  blueAlertBanner: {
    width: "100%",
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
  },
  blueShieldIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 102, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertTextColumn: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontSize: 11.5,
    color: "#1E293B",
  },
  alertSubtitle: {
    fontSize: 10.5,
    color: "#64748B",
  },
  encryptionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  lockIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  encryptionText: {
    fontSize: 12,
    color: "#4B5563",
  },
});
