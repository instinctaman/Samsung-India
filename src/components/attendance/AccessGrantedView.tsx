import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import CalendarIcon from "@/assets/images/svg/calender2.svg";
import ClockIcon from "@/assets/images/svg/clock.svg";
import LocationIcon from "@/assets/images/svg/location.svg";
import Sparkle from "@/assets/images/svg/sparkle.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";
import { createShadow } from "@/theme/shadows";

export type AccessGrantedDetail = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  details: AccessGrantedDetail[];
  onContinue: () => void;
  onHome: () => void;
};

export default function AccessGrantedView({
  details,
  onContinue,
  onHome,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top Green Hero Section */}
        <View style={styles.successArea}>
          <View style={styles.successHalo}>
            <Sparkle width={170} height={80} style={styles.sparkle} />
            <View style={styles.successRing}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={48} color={Colors.success} />
              </View>
            </View>
          </View>

          <AppText
            variant="h1"
            color={Colors.white}
            weight={FontWeight.bold}
            align="center"
            style={styles.title}
          >
            Access Granted!
          </AppText>
          <AppText
            variant="label"
            color="rgba(255, 255, 255, 0.95)"
            align="center"
            style={styles.subtitle}
          >
            Your attendance is permanently recorded.
          </AppText>
        </View>

        {/* Content Section: Overlapping Details Card + Bottom Actions */}
        <View style={styles.content}>
          <View style={styles.detailsCard}>
            {details.map((detail, index) => (
              <DetailRow
                key={detail.label}
                {...detail}
                isLast={index === details.length - 1}
              />
            ))}
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <Pressable
              style={styles.continueButton}
              onPress={onContinue}
              accessibilityRole="button"
              accessibilityLabel="Great, Continue"
            >
              <AppText
                variant="h3"
                color={Colors.white}
                weight={FontWeight.bold}
              >
                Great, Continue
              </AppText>
            </Pressable>

            <Pressable
              style={styles.homeLink}
              onPress={onHome}
              accessibilityRole="button"
              accessibilityLabel="Back to Home"
              hitSlop={8}
            >
              <Ionicons name="home-outline" size={15} color={Colors.success} />
              <AppText
                variant="caption"
                color={Colors.success}
                weight={FontWeight.semiBold}
              >
                Back to Home
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  icon,
  isLast,
}: AccessGrantedDetail & { isLast: boolean }) {
  return (
    <View style={[styles.detailRow, !isLast && styles.detailBorder]}>
      <View style={styles.detailIcon}>
        {icon === "calendar-outline" ||
        label.toLowerCase().includes("session") ||
        label.toLowerCase().includes("date") ? (
          <CalendarIcon width={20} height={20} color="#1CB07D" />
        ) : icon === "time-outline" ||
          label.toLowerCase().includes("time") ||
          label.toLowerCase().includes("checked") ? (
          <ClockIcon width={20} height={20} color="#1CB07D" />
        ) : icon === "location-outline" ||
          label.toLowerCase().includes("location") ? (
          <LocationIcon width={18} height={22} color="#1CB07D" />
        ) : (
          <Ionicons name={icon} size={22} color={Colors.success} />
        )}
      </View>
      <View style={styles.detailTextColumn}>
        <AppText variant="caption" color={Colors.gray600}>
          {label}
        </AppText>
        <AppText variant="label" color="#111827" weight={FontWeight.semiBold}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FFF9",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.success,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  successArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingBottom: 235,
    paddingHorizontal: 20,
  },
  successHalo: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.035)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  sparkle: { position: "absolute", top: -28, zIndex: 0 },
  successRing: {
    width: 134,
    height: 134,
    zIndex: 1,
    borderRadius: 67,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 3, blur: 6, opacity: 0.08, elevation: 2 }),
  },
  title: {
    marginTop: 16,
  },
  subtitle: {
    marginTop: 4,
  },

  // Overlapping Content
  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 20,
    marginTop: -205,
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  detailsCard: {
    width: "100%",
    flex: 1,
    minHeight: 290,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: "space-between",
    ...createShadow({ x: 0, y: 8, blur: 20, opacity: 0.09, elevation: 5 }),
  },
  detailRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },
  detailBorder: { borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  detailIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#D8F8EB",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTextColumn: {
    flex: 1,
    gap: 2,
  },

  // Bottom Actions directly under card
  bottomActions: {
    width: "100%",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  continueButton: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 4, blur: 10, opacity: 0.12, elevation: 3 }),
  },
  homeLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
});
