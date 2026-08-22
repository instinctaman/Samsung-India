import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppText from "@/components/ui/AppText";
import ScreenBanner from "@/components/ui/ScreenBanner";
import AccessGrantedView from "@/components/attendance/AccessGrantedView";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/typography";
import { setSessionFlowState } from "@/api/session";
import { useAttendance } from "@/hooks/useAttendance";

export default function AttendanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    conferenceUid: string;
    title?: string;
    location?: string;
    time?: string;
    endTime?: string;
  }>();

  const { status, markedOn, error, retry, confirmAttendanceRecorded } =
    useAttendance(params.conferenceUid);

  const handleNavigateToSession = () => {
    confirmAttendanceRecorded();
    router.replace({
      pathname: "/session_detail",
      params: { flow: "ATTENDANCE_RECORDED", attendance: "completed" },
    });
  };

  if (status === "checking-in") {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenBanner backgroundColor={Colors.success}>
          <View style={styles.bannerRow}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Ionicons name="arrow-back" size={20} color={Colors.white} />
            </Pressable>
            <AppText
              style={styles.bannerTitle}
              color={Colors.white}
              weight={FontWeight.semiBold}
            >
              Attendance
            </AppText>
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
            <AppText
              style={styles.bannerTitle}
              color={Colors.white}
              weight={FontWeight.semiBold}
            >
              Attendance
            </AppText>
          </View>
        </ScreenBanner>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
          <AppText style={styles.loadingText}>{error}</AppText>
          <Pressable style={styles.retryButton} onPress={retry}>
            <AppText color={Colors.white} weight={FontWeight.medium}>
              Try Again
            </AppText>
          </Pressable>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <AppText style={styles.homeText} color={Colors.gray600}>
              Go Back
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
          label: "Checked In",
          value: markedOn
            ? markedOn.split(" ")[1]?.slice(0, 5) ?? markedOn
            : "--",
          icon: "calendar-outline",
        },
        {
          label: "Location",
          value: params.location || "--",
          icon: "location-outline",
        },
      ]}
      onContinue={handleNavigateToSession}
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
  container: { flex: 1, backgroundColor: Colors.background },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  bannerTitle: { fontSize: Fonts.h3 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  homeText: { fontSize: Fonts.caption },
});
