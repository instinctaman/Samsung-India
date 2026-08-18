import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppText from "@/components/ui/AppText";
import ScreenBanner from "@/components/ui/ScreenBanner";
import AccessGrantedView from "@/components/attendance/AccessGrantedView";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, checkIn } from "@/api/attendance";
import { setAttendanceState, setSessionFlowState } from "@/api/session";

export default function AttendanceScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const params = useLocalSearchParams<{
    conferenceUid: string;
    title?: string;
    location?: string;
    time?: string;
    endTime?: string;
  }>();

  const [status, setStatus] = useState<"checking-in" | "done" | "error">("checking-in");
  const [markedOn, setMarkedOn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const markAttendance = useCallback(async () => {
    if (!token || !params.conferenceUid) return;
    setStatus("checking-in");
    setError(null);
    try {
      const result = await checkIn(token, params.conferenceUid);
      setMarkedOn(result.markedOn);
      setStatus("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't mark your attendance.");
      setStatus("error");
    }
  }, [token, params.conferenceUid]);

  useEffect(() => {
    markAttendance();
  }, [markAttendance]);

  if (status === "checking-in") {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenBanner backgroundColor={Colors.success}>
          <View style={styles.bannerRow}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </Pressable>
            <AppText style={styles.bannerTitle} color={Colors.white} weight={FontWeight.semiBold}>Attendance</AppText>
          </View>
        </ScreenBanner>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.success} size="large" />
          <AppText style={styles.loadingText}>Marking your attendance…</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenBanner backgroundColor={Colors.success}>
          <View style={styles.bannerRow}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </Pressable>
            <AppText style={styles.bannerTitle} color={Colors.white} weight={FontWeight.semiBold}>Attendance</AppText>
          </View>
        </ScreenBanner>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <AppText style={styles.loadingText}>{error}</AppText>
          <Pressable style={styles.retryButton} onPress={markAttendance}>
            <AppText color={Colors.white} weight={FontWeight.medium}>Try Again</AppText>
          </Pressable>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <AppText style={styles.homeText} color={Colors.gray600}>Go Back</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <AccessGrantedView
      details={[
        { label: "Session", value: params.title || "Training Session", icon: "calendar-outline" },
        { label: "Time", value: [params.time, params.endTime].filter(Boolean).join(" - ") || "--", icon: "time-outline" },
        { label: "Checked In", value: markedOn ? markedOn.split(" ")[1]?.slice(0, 5) ?? markedOn : "--", icon: "calendar-outline" },
        { label: "Location", value: params.location || "--", icon: "location-outline" },
      ]}
      onContinue={() => {
        setSessionFlowState("ATTENDANCE_RECORDED");
        router.replace({
          pathname: "/session_detail",
          params: { flow: "ATTENDANCE_RECORDED", attendance: "completed" },
        });
      }}
      onHome={() => {
        setSessionFlowState("ATTENDANCE_RECORDED");
        router.replace({
          pathname: "/session_detail",
          params: { flow: "ATTENDANCE_RECORDED", attendance: "completed" },
        });
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerTitle: { fontSize: Fonts.h3 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24 },
  loadingText: { fontSize: Fonts.body, color: Colors.gray600, textAlign: "center" },
  retryButton: { backgroundColor: Colors.success, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 4 },
  homeText: { fontSize: Fonts.caption },
});
