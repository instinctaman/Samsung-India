import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";
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

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Concentric Radar Rings & Location Pin Graphic */}
        <View style={styles.radarWrapper}>
          <View style={styles.radarOuterRing}>
            <View style={styles.radarMidRing}>
              <View style={styles.radarInnerRing}>
                <View style={styles.radarCenterCircle}>
                  <Ionicons
                    name="location-sharp"
                    size={38}
                    color="#00A66E"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Heading & Verification Meta */}
        <AppText style={styles.title} weight={FontWeight.bold}>
          LOCATION VERIFIED
        </AppText>
        <AppText style={styles.subtitle}>
          {subtitleText}
        </AppText>

        {/* Center Pill Divider */}
        <View style={styles.pillDivider} />

        {/* White Rounded Information Card */}
        <View style={styles.infoCard}>
          <InfoRow
            icon="calendar-outline"
            label="Session"
            value={info.sessionTitle}
          />
          <View style={styles.rowDivider} />

          <InfoRow
            icon="time-outline"
            label="Session Time"
            value={info.sessionTime}
          />
          <View style={styles.rowDivider} />

          <InfoRow
            icon="calendar-outline"
            label="Date"
            value={info.date}
          />
          <View style={styles.rowDivider} />

          <InfoRow
            icon="location-outline"
            label="Location"
            value={info.location}
          />
        </View>

        {/* Green "Great, Continue" Primary Button */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#00A66E" />
      </View>
      <View style={styles.infoTextColumn}>
        <AppText style={styles.infoLabel}>{label}</AppText>
        <AppText style={styles.infoValue} weight={FontWeight.bold}>
          {value}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00A66E",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00A66E",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 36,
    alignItems: "center",
  },

  // Concentric Radar Rings
  radarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  radarOuterRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarMidRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarInnerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  radarCenterCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 4, blur: 10, opacity: 0.15, elevation: 4 }),
  },

  // Typography
  title: {
    fontSize: 24,
    color: Colors.white,
    letterSpacing: 0.8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.95)",
    marginTop: 6,
    textAlign: "center",
  },

  // Divider
  pillDivider: {
    width: 76,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginTop: 18,
    marginBottom: 18,
  },

  // Info Card
  infoCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    ...createShadow({ x: 0, y: 4, blur: 14, opacity: 0.1, elevation: 4 }),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E8F8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextColumn: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 14,
    color: "#111827",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  // Action Button
  continueButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#009B60",
    borderRadius: Radius.card,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  continueText: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
