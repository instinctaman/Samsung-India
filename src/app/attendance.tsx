import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import Sparkle from "@/assets/images/svg/sparkle.svg";

const details = [
  { label: "Session", value: "Training Session", icon: "calendar" },
  { label: "Time", value: "10:00 AM - 02:00 PM", icon: "time-outline" },
  { label: "Date", value: "06 Jun 2026", icon: "calendar" },
  { label: "Location", value: "New Delhi", icon: "location-outline" },
] as const;

export default function AttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
          onPress={() => router.replace({ pathname: "/session_detail", params: { attendance: "recorded" } })}
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

function DetailRow({ label, value, icon, isLast }: typeof details[number] & { isLast: boolean }) {
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
