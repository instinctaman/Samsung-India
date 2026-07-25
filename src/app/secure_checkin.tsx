import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";

import AppText from "@/components/ui/AppText";
import AccessGrantedView from "@/components/attendance/AccessGrantedView";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, VerifyLocationResult, secureCheckIn, verifyLocation } from "@/api/attendance";

type Step = "locating" | "location-verified" | "capturing" | "photo-preview" | "submitting" | "granted" | "error";

function formatDistance(meters: number | null) {
  if (meters == null) return null;
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}

export default function SecureCheckInScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    conferenceUid: string;
    title?: string;
    location?: string;
    time?: string;
    endTime?: string;
  }>();

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const [step, setStep] = useState<Step>("locating");
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationResult, setLocationResult] = useState<VerifyLocationResult | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<Date | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [tipsExpanded, setTipsExpanded] = useState(false);
  const [markedOn, setMarkedOn] = useState<string | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  const runLocationCheck = useCallback(async () => {
    if (!token || !params.conferenceUid) return;
    setStep("locating");
    setError(null);
    try {
      const permissionResult = await Location.requestForegroundPermissionsAsync();
      if (!permissionResult.granted) {
        setError("Location access is required to check in for this session.");
        setStep("error");
        return;
      }
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const point = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setCoords(point);

      const result = await verifyLocation(token, params.conferenceUid, point.latitude, point.longitude);
      setLocationResult(result);
      setVerifiedAt(new Date());
      setStep("location-verified");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't verify your location.");
      setStep("error");
    }
  }, [token, params.conferenceUid]);

  useEffect(() => {
    runLocationCheck();
  }, [runLocationCheck]);

  useEffect(() => {
    if (step === "capturing" && !permission?.granted) requestPermission();
  }, [step, permission, requestPermission]);

  const handleCapture = async () => {
    if (!cameraRef.current || !cameraReady) return;
    try {
      // Lower quality keeps the upload small enough to survive weak venue
      // Wi-Fi - still plenty for a face-verification check.
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.4, exif: false });
      if (photo?.uri) {
        setPhotoUri(photo.uri);
        setStep("photo-preview");
      }
    } catch {
      setError("Couldn't capture the photo. Please try again.");
      setStep("error");
    }
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setCameraReady(false);
    setStep("capturing");
  };

  const handleProceed = async () => {
    if (!token || !params.conferenceUid || !coords || !photoUri) return;
    setStep("submitting");
    setError(null);
    try {
      const result = await secureCheckIn(token, {
        conferenceUid: params.conferenceUid,
        latitude: coords.latitude,
        longitude: coords.longitude,
        photo: { uri: photoUri, name: "checkin.jpg", type: "image/jpeg" },
      });
      setMarkedOn(result.markedOn);
      setDistanceMeters(result.distanceMeters);
      setStep("granted");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't submit your check-in.");
      setStep("error");
    }
  };

  if (step === "locating" || step === "submitting") {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.success} size="large" />
        <AppText style={styles.loadingText}>
          {step === "locating" ? "Verifying your location…" : "Submitting your check-in…"}
        </AppText>
      </SafeAreaView>
    );
  }

  if (step === "error") {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText style={styles.loadingText}>{error}</AppText>
        <Pressable style={styles.retryButton} onPress={runLocationCheck}>
          <AppText color={Colors.white} weight={FontWeight.medium}>Try Again</AppText>
        </Pressable>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <AppText style={styles.homeText} color={Colors.gray600}>Go Back</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (step === "granted") {
    return (
      <AccessGrantedView
        details={[
          { label: "Session", value: params.title || "Training Session", icon: "calendar-outline" },
          { label: "Time", value: [params.time, params.endTime].filter(Boolean).join(" - ") || "--", icon: "time-outline" },
          { label: "Date", value: params.time ? new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "--", icon: "calendar-outline" },
          { label: "Location", value: params.location || locationResult?.venueLabel || "--", icon: "location-outline" },
        ]}
        onContinue={() => router.back()}
        onHome={() => router.replace("/")}
      />
    );
  }

  if (step === "location-verified") {
    const distanceLabel = formatDistance(locationResult?.distanceMeters ?? null);
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.verifiedHeader}>
          <View style={styles.verifiedIconCircle}>
            <Ionicons name="location" size={30} color={Colors.white} />
          </View>
          <AppText style={styles.verifiedTitle} weight={FontWeight.semiBold}>Location Verified</AppText>
          <AppText style={styles.verifiedSubtitle} color={Colors.gray600}>
            {verifiedAt?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            {distanceLabel ? ` • ${distanceLabel} from ${locationResult?.venueLabel ?? "venue"}` : locationResult?.venueLabel ? ` at ${locationResult.venueLabel}` : ""}
          </AppText>
        </View>

        <View style={styles.content}>
          <View style={styles.detailsCard}>
            <SummaryRow label="Session" value={params.title || "Training Session"} icon="calendar-outline" isLast={false} />
            <SummaryRow label="Session Time" value={[params.time, params.endTime].filter(Boolean).join(" - ") || "--"} icon="time-outline" isLast={false} />
            <SummaryRow label="Date" value={new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} icon="calendar-outline" isLast={false} />
            <SummaryRow label="Location" value={params.location || locationResult?.venueLabel || "--"} icon="location-outline" isLast />
          </View>

          <Pressable style={styles.continueButton} onPress={() => setStep("capturing")}>
            <AppText color={Colors.white} weight={FontWeight.medium}>Great, Continue</AppText>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // step === "capturing" | "photo-preview"
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.checkinHeader}>
        <AppText style={styles.checkinTitle} weight={FontWeight.semiBold}>Security Check-In</AppText>
        <AppText style={styles.checkinSubtitle} color={Colors.gray600}>
          Please capture a clear photo of your face to verify your identity
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

        {step === "capturing" ? (
          <Pressable
            style={[styles.captureButton, !cameraReady && styles.captureButtonDisabled]}
            onPress={handleCapture}
            disabled={!permission?.granted || !cameraReady}
          >
            {cameraReady ? (
              <>
                <Ionicons name="camera" size={18} color={Colors.white} />
                <AppText color={Colors.white} weight={FontWeight.medium}>Capture Photo</AppText>
              </>
            ) : (
              <>
                <ActivityIndicator color={Colors.white} size="small" />
                <AppText color={Colors.white} weight={FontWeight.medium}>Preparing camera…</AppText>
              </>
            )}
          </Pressable>
        ) : (
          <View style={styles.reviewRow}>
            <Pressable style={styles.retakeButton} onPress={handleRetake}>
              <Ionicons name="refresh" size={16} color={Colors.gray600} />
              <AppText color={Colors.gray600}>Retake</AppText>
            </Pressable>
            <Pressable style={styles.proceedButton} onPress={handleProceed}>
              <AppText color={Colors.white} weight={FontWeight.medium}>Proceed</AppText>
              <Ionicons name="arrow-forward" size={16} color={Colors.white} />
            </Pressable>
          </View>
        )}

        <Pressable style={styles.tipsRow} onPress={() => setTipsExpanded((v) => !v)}>
          <AppText style={styles.tipsLabel} color={Colors.gray600}>Tips for best results</AppText>
          <Ionicons name={tipsExpanded ? "chevron-up" : "chevron-down"} size={16} color={Colors.gray600} />
        </Pressable>
        {tipsExpanded && (
          <View style={styles.tipsList}>
            <TipRow text="Make sure your face is clearly visible" />
            <TipRow text="Good lighting helps verification" />
          </View>
        )}

        <View style={styles.secureNotice}>
          <Ionicons name="shield-checkmark-outline" size={14} color={Colors.gray600} />
          <AppText style={styles.secureNoticeText} color={Colors.gray600}>Your data is secure and encrypted</AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, icon, isLast }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; isLast: boolean }) {
  return (
    <View style={[styles.summaryRow, !isLast && styles.summaryRowBorder]}>
      <View style={styles.summaryIcon}><Ionicons name={icon} size={18} color={Colors.mainColour1} /></View>
      <View>
        <AppText style={styles.summaryLabel} color={Colors.gray600}>{label}</AppText>
        <AppText style={styles.summaryValue} weight={FontWeight.medium}>{value}</AppText>
      </View>
    </View>
  );
}

function TipRow({ text }: { text: string }) {
  return (
    <View style={styles.tipItem}>
      <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
      <AppText style={styles.tipText} color={Colors.gray600}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24, backgroundColor: Colors.background },
  loadingText: { fontSize: Fonts.body, color: Colors.gray600, textAlign: "center" },
  retryButton: { backgroundColor: Colors.success, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 4 },
  homeText: { fontSize: Fonts.caption },

  verifiedHeader: { alignItems: "center", paddingTop: 32, paddingBottom: 16 },
  verifiedIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.success,
    alignItems: "center", justifyContent: "center", ...{ shadowColor: Colors.black, shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  },
  verifiedTitle: { marginTop: 14, fontSize: Fonts.h2 },
  verifiedSubtitle: { marginTop: 4, fontSize: Fonts.bodySm },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  detailsCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xxl, paddingHorizontal: 14, paddingVertical: 2,
    shadowColor: Colors.black, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 3,
  },
  summaryRow: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10 },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  summaryIcon: { width: 30, height: 30, borderRadius: 8, backgroundColor: "#DDEEFF", alignItems: "center", justifyContent: "center" },
  summaryLabel: { fontSize: Fonts.overline },
  summaryValue: { fontSize: Fonts.bodySm, marginTop: 1 },
  continueButton: {
    marginTop: 20, height: 50, borderRadius: Radius.xl, backgroundColor: Colors.success,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },

  checkinHeader: { alignItems: "center", paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  checkinTitle: { fontSize: Fonts.h2 },
  checkinSubtitle: { marginTop: 6, fontSize: Fonts.bodySm, textAlign: "center", lineHeight: 19 },

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
  captureButtonDisabled: { opacity: 0.6 },
  reviewRow: { marginTop: 16, flexDirection: "row", gap: 12 },
  retakeButton: {
    flex: 1, height: 48, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.gray200,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
  },
  proceedButton: {
    flex: 1, height: 48, borderRadius: Radius.xl, backgroundColor: Colors.success,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
  },

  tipsRow: { marginTop: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  tipsLabel: { fontSize: Fonts.bodySm },
  tipsList: { marginTop: 6, gap: 6 },
  tipItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  tipText: { fontSize: Fonts.overline },

  secureNotice: { marginTop: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  secureNoticeText: { fontSize: Fonts.overline },
});
