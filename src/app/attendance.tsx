import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import Sparkle from "@/assets/images/svg/sparkle.svg";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, checkIn } from "@/api/attendance";

export default function AttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const details = [
    { label: "Session", value: params.title || "Training Session", icon: "calendar" as const },
    { label: "Time", value: [params.time, params.endTime].filter(Boolean).join(" - ") || "--", icon: "time-outline" as const },
    { label: "Checked In", value: markedOn ? markedOn.split(" ")[1]?.slice(0, 5) ?? markedOn : "--", icon: "calendar" as const },
    { label: "Location", value: params.location || "--", icon: "location-outline" as const },
  ];

  if (status === "checking-in") {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.success} size="large" />
        <AppText style={styles.loadingText}>Marking your attendance…</AppText>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText style={styles.loadingText}>{error}</AppText>
        <Pressable style={styles.retryButton} onPress={markAttendance}>
          <AppText color={Colors.white} weight={FontWeight.medium}>Try Again</AppText>
        </Pressable>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <AppText style={styles.homeText} color={Colors.gray600}>Go Back</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />
      <View style={styles.successArea}>
        <View style={styles.successHalo}>
          <Sparkle width={219} height={101} style={styles.sparkle} />
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={Fonts.iconSize} color={Colors.success} />
            </View>
          </View>
        </View>
        <AppText style={styles.title} color={Colors.white} weight={FontWeight.semiBold}>Access Granted!</AppText>
        <AppText style={styles.subtitle} color={Colors.white}>Your attendance is permanently recorded.</AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.detailsCard}>
          {details.map((detail, index) => <DetailRow key={detail.label} {...detail} isLast={index === details.length - 1} />)}
        </View>
        <Pressable
          style={styles.continueButton}
          onPress={() => router.back()}
        >
          <AppText style={styles.continueText} color={Colors.white} weight={FontWeight.medium}>Great, Continue</AppText>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </Pressable>
        <Pressable style={styles.homeLink} onPress={() => router.replace("/")}>
          <Ionicons name="home-outline" size={13} color={Colors.success} />
          <AppText style={styles.homeText} color={Colors.success}>Back to Home</AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, icon, isLast }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; isLast: boolean }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailBorder]}>
      <View style={styles.detailIcon}><Ionicons name={icon === "calendar" ? "calendar-outline" : icon} size={20} color={Colors.success} /></View>
      <View>
        <AppText style={styles.detailLabel}>{label}</AppText>
        <AppText style={styles.detailValue} weight={FontWeight.medium}>{value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2FFF9" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24, backgroundColor: Colors.background },
  loadingText: { fontSize: Fonts.body, color: Colors.gray600, textAlign: "center" },
  retryButton: { backgroundColor: Colors.success, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 4 },
  statusBarBackground: { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: Colors.success },
  successArea: { height: "80%", minHeight: 350, alignItems: "center", justifyContent: "center", backgroundColor: Colors.success, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, paddingBottom: 72 },
  successHalo: { width: 144, height: 144, borderRadius: 72, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.035)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.06)" },
  sparkle: { position: "absolute", top: -65, zIndex: 0 },
  successRing: { width: 116, height: 116, zIndex: 1, borderRadius: 58, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.07)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.08)" },
  successCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", shadowColor: Colors.black, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 2 },
  title: { marginTop: 23, fontSize: Fonts.h1 },
  subtitle: { marginTop: 4, fontSize: Fonts.body },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 21, marginTop: -165 },
  detailsCard: {
    width: "100%", backgroundColor: Colors.white, borderRadius: 17, paddingHorizontal: 12, paddingVertical: 3, shadowColor: Colors.black, shadowOpacity: 0.12, shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10, elevation: 4
  },
  detailRow: { minHeight: 46, flexDirection: "row", alignItems: "center", gap: 10 },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  detailIcon: { width: 25, height: 25, borderRadius: 5, backgroundColor: "#D8F8EB", alignItems: "center", justifyContent: "center" },
  detailLabel: { fontSize: Fonts.overline, color: Colors.gray600 },
  detailValue: { fontSize: Fonts.bodySm, marginTop: 1 },
  continueButton: { width: "100%", height: 32, marginTop: 15, borderRadius: 7, backgroundColor: "#00A86B", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  continueText: { fontSize: Fonts.body },
  homeLink: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 5 },
  homeText: { fontSize: Fonts.caption },
});
