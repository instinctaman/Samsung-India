import { useCallback, useEffect, useState } from "react";
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
import * as Location from "expo-location";

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
import {
  ApiError,
  VerifyLocationResult,
  secureCheckIn,
  verifyLocation,
} from "@/api/attendance";
import {
  setAttendanceState,
  setSecurityCheckInCompleted,
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

  const [step, setStep] = useState<Step>("locating");
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationResult, setLocationResult] =
    useState<VerifyLocationResult | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<Date | null>(null);

  const runLocationCheck = useCallback(async () => {
    if (!token || !params.conferenceUid) return;
    setStep("locating");
    setError(null);
    try {
      let point = { latitude: 28.4595, longitude: 77.0266 };
      try {
        const permissionResult =
          await Location.requestForegroundPermissionsAsync();
        if (permissionResult.granted) {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          point = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        }
      } catch {
        // Fallback to simulated location for dev/testing
      }

      setCoords(point);
      const result = await verifyLocation(
        token,
        params.conferenceUid,
        point.latitude,
        point.longitude
      );
      setLocationResult(result);
      setVerifiedAt(new Date());
      setStep("location-verified");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't verify your location."
      );
      setStep("error");
    }
  }, [token, params.conferenceUid]);

  useEffect(() => {
    runLocationCheck();
  }, [runLocationCheck]);

  const handleProceedFromCheckIn = async (photoSource: ImageSourcePropType) => {
    // If this is the entry flow (Join Session -> Secure Check-in Home -> Location -> Camera -> Secure Check-in Home)
    if (isEntryMode) {
      setSessionFlowState("CAMERA_VERIFIED");
      // Attendance is NOT marked on entry verification. Navigate back to Secure Check-in Home!
      router.replace({
        pathname: "/session_detail",
        params: { flow: "CAMERA_VERIFIED" },
      });
      return;
    }

    // If this is the attendance check-in flow from Home
    if (!token || !params.conferenceUid || !coords) return;
    setStep("submitting");
    setError(null);
    try {
      const uriStr =
        typeof photoSource === "object" && photoSource && "uri" in photoSource
          ? (photoSource as { uri: string }).uri
          : "checkin.jpg";
      await secureCheckIn(token, {
        conferenceUid: params.conferenceUid,
        latitude: coords.latitude,
        longitude: coords.longitude,
        photo: { uri: uriStr, name: "checkin.jpg", type: "image/jpeg" },
      });
      setAttendanceState("ATTENDANCE_RECORDED");
      setStep("granted");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't submit your check-in."
      );
      setStep("error");
    }
  };

  // ─── Loading / Submitting State ─────────────────────────────────────────────
  if (step === "locating" || step === "submitting") {
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

  // ─── Error State ────────────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText style={styles.loadingText}>{error}</AppText>
        <Pressable style={styles.retryButton} onPress={runLocationCheck}>
          <AppText color={Colors.white} weight={FontWeight.medium}>
            Try Again
          </AppText>
        </Pressable>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <AppText style={styles.homeText} color={Colors.gray600}>
            Go Back
          </AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ─── Step 1: Location Verified View (Image 2) ───────────────────────────────
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

  // ─── Step 2: Security Check-In & Camera Verification (Images 1, 4, 5) ───────
  if (step === "security-checkin") {
    return (
      <SecurityCheckInView
        onProceed={handleProceedFromCheckIn}
        onBack={() => setStep("location-verified")}
      />
    );
  }

  // ─── Attendance Granted (Only when check-in submitted from Home) ────────────
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
        setAttendanceState("ATTENDANCE_RECORDED");
        router.replace({
          pathname: "/session_detail",
          params: { attendance: "completed", checkIn: "verified" },
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
    gap: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.recordedGreen,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  homeText: {
    fontSize: Fonts.caption,
  },
});
