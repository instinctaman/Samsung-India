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
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";
import { createShadow } from "@/theme/shadows";

export type LocationVerifiedInfo = {
  sessionTitle: string;
  sessionTime: string;
  date: string;
  location: string;
  verifiedTime?: string;
  venueLabel?: string;
  distanceLabel?: string;
};

type Props = {
  info: LocationVerifiedInfo;
  onContinue: () => void;
};

export default function LocationVerifiedView({
  info,
  onContinue,
}: Props) {
  const insets = useSafeAreaInsets();

  const formattedTime =
    info.verifiedTime ||
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const venueName = info.venueLabel || info.location || "Gurugram Sector 4";
  const subtitleText = `${formattedTime} at 20th from ${venueName}`;

  const rows = [
    {
      label: "Session",
      value: info.sessionTitle,
      renderIcon: () => <CalendarIcon width={22} height={22} color="#1CB07D" />,
    },
    {
      label: "Session Time",
      value: info.sessionTime,
      renderIcon: () => <ClockIcon width={22} height={22} color="#1CB07D" />,
    },
    {
      label: "Date",
      value: info.date,
      renderIcon: () => <CalendarIcon width={22} height={22} color="#1CB07D" />,
    },
    {
      label: "Location",
      value: info.location,
      renderIcon: () => <LocationIcon width={20} height={24} color="#1CB07D" />,
    },
  ];

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
        <View style={styles.heroArea}>
          {/* Concentric Radar Rings & Location Pin Graphic */}
          <View style={styles.radarWrapper}>
            <View style={styles.radarOuterRing}>
              <View style={styles.radarMidRing}>
                <View style={styles.radarInnerRing}>
                  <View style={styles.radarCenterCircle}>
                    <Ionicons name="location-sharp" size={48} color="#00A86B" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Heading & Verification Meta */}
          <AppText
            color={Colors.white}
            weight={FontWeight.semiBold}
            align="center"
            style={styles.title}
          >
            LOCATION VERIFIED
          </AppText>
          <AppText
            color="rgba(255, 255, 255, 0.95)"
            weight={FontWeight.medium}
            align="center"
            style={styles.subtitle}
          >
            {subtitleText}
          </AppText>

          {/* Center Pill Divider */}
          <View style={styles.pillDivider} />
        </View>

        {/* Content Section: Full Height Card + Action directly underneath */}
        <View style={styles.content}>
          <View style={styles.detailsCard}>
            {rows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.detailRow,
                  index !== rows.length - 1 && styles.detailBorder,
                ]}
              >
                <View style={styles.detailIcon}>
                  {row.renderIcon()}
                </View>
                <View style={styles.detailTextColumn}>
                  <AppText
                    style={styles.detailLabel}
                    color={Colors.gray600}
                    weight={FontWeight.regular}
                  >
                    {row.label}
                  </AppText>
                  <AppText
                    style={styles.detailValue}
                    color="#111827"
                    weight={FontWeight.medium}
                  >
                    {row.value}
                  </AppText>
                </View>
              </View>
            ))}
          </View>

          {/* Primary Action Button */}
          <Pressable
            style={styles.continueButton}
            onPress={onContinue}
            accessibilityRole="button"
            accessibilityLabel="Great, Continue"
          >
            <AppText
              style={styles.continueButtonText}
              color={Colors.white}
              weight={FontWeight.medium}
            >
              Great, Continue
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
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

  // Top Green Area
  heroArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 24,
    paddingBottom: 250,
    paddingHorizontal: 20,
  },
  radarWrapper: {
    width: 213,
    height: 213,
    alignItems: "center",
    justifyContent: "center",
  },
  radarOuterRing: {
    width: 213,
    height: 213,
    borderRadius: 106.5,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarMidRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarInnerRing: {
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: "rgba(255, 255, 255, 0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarCenterCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 3, blur: 6, opacity: 0.08, elevation: 2 }),
  },

  title: {
    marginTop: 18,
    letterSpacing: 0.5,
    fontSize: 29,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
  },
  pillDivider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginTop: 12,
  },

  // Overlapping Content
  content: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 20,
    marginTop: -210,
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  detailsCard: {
    width: "100%",
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 27,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: "space-between",
    ...createShadow({ x: 0, y: 8, blur: 20, opacity: 0.09, elevation: 5 }),
  },
  detailRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 10,
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: "#D8F8EB",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTextColumn: {
    flex: 1,
    gap: 3,
  },
  detailLabel: {
    fontSize: 11.5,
  },
  detailValue: {
    fontSize: 14,
  },

  // Bottom Action directly under card
  continueButton: {
    width: "100%",
    height: 52,
    marginTop: 22,
    borderRadius: 12,
    backgroundColor: "#00A86B",
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 4, blur: 10, opacity: 0.12, elevation: 3 }),
  },
  continueButtonText: {
    fontSize: 18,
  },
});
