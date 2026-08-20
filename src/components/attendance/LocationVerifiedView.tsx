import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
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

export default function LocationVerifiedView({ info, onContinue }: Props) {
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
      icon: "calendar-outline" as const,
    },
    {
      label: "Session Time",
      value: info.sessionTime,
      icon: "time-outline" as const,
    },
    {
      label: "Date",
      value: info.date,
      icon: "calendar-outline" as const,
    },
    {
      label: "Location",
      value: info.location,
      icon: "location-outline" as const,
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
          <AppText style={styles.title} weight={FontWeight.bold}>
            LOCATION VERIFIED
          </AppText>
          <AppText style={styles.subtitle}>{subtitleText}</AppText>

          {/* Center Pill Divider */}
          <View style={styles.pillDivider} />
        </View>

        {/* Content Section: Full Height Card + Button directly under card */}
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
                  <Ionicons name={row.icon} size={27} color={Colors.success} />
                </View>
                <View style={styles.detailTextColumn}>
                  <AppText style={styles.detailLabel}>{row.label}</AppText>
                  <AppText
                    style={styles.detailValue}
                    weight={FontWeight.medium}
                  >
                    {row.value}
                  </AppText>
                </View>
              </View>
            ))}
          </View>

          {/* Green "Great, Continue" Primary Button directly under the card */}
          <Pressable
            style={styles.continueButton}
            onPress={onContinue}
            accessibilityRole="button"
            accessibilityLabel="Great, Continue"
          >
            <AppText
              color={Colors.white}
              style={styles.continueText}
              weight={FontWeight.bold}
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
    paddingBottom: 32,
  },

  // Top Green Area
  heroArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 30,
    paddingBottom: 270,
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

  // Typography
  title: {
    marginTop: 18,
    fontSize: 24,
    color: Colors.white,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
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
    marginTop: -245,
  },
  detailsCard: {
    width: "100%",
    height: 295,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-around",
    ...createShadow({ x: 0, y: 8, blur: 20, opacity: 0.09, elevation: 5 }),
  },
  detailRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#D8F8EB",
    alignItems: "center",
    justifyContent: "center",
  },
  detailTextColumn: {
    flex: 1,
    gap: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
  },

  // Actions directly under card
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
  continueText: {
    fontSize: 18,
    fontWeight: "700",
  },
});
