import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppText from "@/components/ui/AppText";
import {
  AccessGrantedView,
  LocationVerifiedView,
  SecurityCheckInView,
} from "@/components/attendance";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

import { useAuth } from "@/hooks/useAuth";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import {
  ApiError,
  VerifyLocationResult,
  secureCheckIn,
  verifyLocation,
} from "@/api/attendance";
import {
  setAttendanceState,
  setSessionFlowState,
} from "@/api/session";

type Step =
  | "locating"
  | "location-verified"
  | "security-checkin"
  | "submitting"
  | "granted"
  | "error";

export default function SecureCheckInScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    conferenceUid: string;
    title?: string;
    location?: string;
    time?: string;
    endTime?: string;
    date?: string;
    mode?: "entry" | "attendance";
  }>();

  const isEntryMode = params.mode !== "attendance";

  const {
    permissionState,
    coords: locationCoords,
    loading: locationLoading,
    error: locationError,
    requestLocationWithRationale,
    openSettings,
  } = useLocationPermission();

  const [step, setStep] = useState<Step>("locating");
  const [error, setError] = useState<string | null>(null);
  const [activeCoords, setActiveCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationResult, setLocationResult] =
    useState<VerifyLocationResult | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<Date | null>(null);

  const startLocationVerification = useCallback(async () => {
    if (!token || !params.conferenceUid) return;
    setStep("locating");
    setError(null);

    const { coords, status, error: permError } =
      await requestLocationWithRationale();

    if (status === "granted" && coords) {
      setActiveCoords(coords);
      try {
        const result = await verifyLocation(
          token,
          params.conferenceUid,
          coords.latitude,
          coords.longitude,
        );
        setLocationResult(result);
        setVerifiedAt(new Date());
        setStep("location-verified");
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Couldn't verify your location with the venue.",
        );
        setStep("error");
      }
    } else {
      setError(
        permError ||
          (status === "blocked"
            ? "Location permission is permanently blocked. Please enable it in Settings."
            : status === "unavailable"
              ? "Device GPS is disabled. Please turn on Location in Settings."
              : "Location access was denied. Location verification is required for check-in."),
      );
      setStep("error");
    }
  }, [token, params.conferenceUid, requestLocationWithRationale]);

  const hasInitiatedRef = useRef(false);

  useEffect(() => {
    if (!hasInitiatedRef.current) {
      hasInitiatedRef.current = true;
      startLocationVerification();
    }
  }, [startLocationVerification]);

  const handleProceedFromCheckIn = async (photoSource: ImageSourcePropType) => {
    if (isEntryMode) {
      setSessionFlowState("CAMERA_VERIFIED");
      router.replace({
        pathname: "/session_detail",
        params: { flow: "CAMERA_VERIFIED" },
      });
      return;
    }

    const currentCoords = activeCoords || locationCoords;
    if (!token || !params.conferenceUid || !currentCoords) return;
    setStep("submitting");
    setError(null);
    try {
      const uriStr =
        typeof photoSource === "object" && photoSource && "uri" in photoSource
          ? (photoSource as { uri: string }).uri
          : "checkin.jpg";
      await secureCheckIn(token, {
        conferenceUid: params.conferenceUid,
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
        photo: { uri: uriStr, name: "checkin.jpg", type: "image/jpeg" },
      });
      setAttendanceState("ATTENDANCE_RECORDED");
      setStep("granted");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't submit your check-in.",
      );
      setStep("error");
    }
  };

  // ─── Loading / Submitting State ─────────────────────────────────────────────
  if (step === "locating" || step === "submitting" || locationLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.recordedGreen} size="large" />
        <AppText style={styles.loadingText}>
          {step === "locating"
            ? "Verifying your location…"
            : "Submitting your check-in…"}
        </AppText>
      </SafeAreaView>
    );
  }

  // ─── Error State (Denied, Blocked, Unavailable, Network Error) ─────────────
  if (step === "error") {
    const isBlocked =
      permissionState === "blocked" || permissionState === "unavailable";
    const errorMessage =
      error || locationError || "Couldn't verify your location.";

    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText style={styles.loadingText}>{errorMessage}</AppText>

        <View style={styles.errorActions}>
          {isBlocked ? (
            <Pressable style={styles.primaryButton} onPress={openSettings}>
              <Ionicons name="settings-outline" size={16} color={Colors.white} />
              <AppText color={Colors.white} weight={FontWeight.medium}>
                Open Device Settings
              </AppText>
            </Pressable>
          ) : (
            <Pressable
              style={styles.primaryButton}
              onPress={startLocationVerification}
            >
              <Ionicons name="refresh" size={16} color={Colors.white} />
              <AppText color={Colors.white} weight={FontWeight.medium}>
                Allow Location & Try Again
              </AppText>
            </Pressable>
          )}

          <Pressable
            style={styles.backLink}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <AppText style={styles.homeText} color={Colors.gray600}>
              Go Back
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Step 1: Location Verified View ─────────────────────────────────────────
  if (step === "location-verified") {
    const formattedTime =
      verifiedAt?.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) || "09:16:20";
    const venueName =
      locationResult?.venueLabel || params.location || "Gurugram Sector 4";

    return (
      <LocationVerifiedView
        info={{
          sessionTitle: params.title || "Training Session",
          sessionTime:
            [params.time, params.endTime].filter(Boolean).join(" - ") ||
            "09:00 AM - 02:00 PM",
          date: params.date || "16 July 2026",
          location: params.location || "Gurugram",
          verifiedTime: formattedTime,
          venueLabel: venueName,
        }}
        onContinue={() => setStep("security-checkin")}
      />
    );
  }

  // ─── Step 2: Security Check-In & Camera Verification ───────────────────────
  if (step === "security-checkin") {
    return (
      <SecurityCheckInView
        onProceed={handleProceedFromCheckIn}
        onBack={() => setStep("location-verified")}
      />
    );
  }

  // ─── Attendance Granted ────────────────────────────────────────────────────
  return (
    <AccessGrantedView
      details={[
        {
          label: "Session",
          value: params.title || "Training Session",
          icon: "calendar-outline",
        },
        {
          label: "Time",
          value:
            [params.time, params.endTime].filter(Boolean).join(" - ") || "--",
          icon: "time-outline",
        },
        {
          label: "Date",
          value: params.date || "16 July 2026",
          icon: "calendar-outline",
        },
        {
          label: "Location",
          value: params.location || locationResult?.venueLabel || "Gurugram",
          icon: "location-outline",
        },
      ]}
      onContinue={() => {
        setAttendanceState("ATTENDANCE_RECORDED");
        router.replace({
          pathname: "/session_detail",
          params: { attendance: "completed", checkIn: "verified" },
        });
      }}
      onHome={() => {
        setSessionFlowState("CAMERA_VERIFIED");
        router.replace({
          pathname: "/session_detail",
          params: { flow: "CAMERA_VERIFIED", checkIn: "verified" },
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 22,
  },
  errorActions: {
    width: "100%",
    maxWidth: 280,
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: Colors.recordedGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backLink: {
    paddingVertical: 6,
  },
  homeText: {
    fontSize: Fonts.caption,
  },
});
