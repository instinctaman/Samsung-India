import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type AssessmentMapHeaderProps = {
  timeLeftFormatted?: string;
  progressPercentage?: number;
  onSync?: () => void;
};

export default function AssessmentMapHeader({
  timeLeftFormatted = "06:59",
  progressPercentage = 100,
  onSync,
}: AssessmentMapHeaderProps) {
  return (
    <View style={styles.container}>
      {/* 1. Timer Pill */}
      <View style={styles.timerPill}>
        <Ionicons name="time-outline" size={18} color={Colors.headerBlue} />
        <View>
          <AppText
            style={styles.timerText}
            color={Colors.headerBlue}
            weight={FontWeight.bold}
          >
            {timeLeftFormatted}
          </AppText>
          <AppText style={styles.timerSub}>Time Left</AppText>
        </View>
      </View>

      {/* 2. Overall Progress Bar Pill */}
      <View style={styles.progressPill}>
        <View style={styles.progressLabelRow}>
          <AppText
            style={styles.progressLabel}
            color={Colors.headerBlue}
            weight={FontWeight.semiBold}
          >
            Overall Progress
          </AppText>
          <AppText
            style={styles.progressValue}
            color={Colors.headerBlue}
            weight={FontWeight.bold}
          >
            {progressPercentage}%
          </AppText>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, progressPercentage))}%` },
            ]}
          />
        </View>
      </View>

      {/* 3. Cloud Sync Button */}
      <Pressable
        style={styles.cloudButton}
        onPress={onSync}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Sync Assessment Map"
      >
        <Ionicons name="cloud-done-outline" size={18} color={Colors.headerBlue} />
      </Pressable>

      {/* 4. Green Wi-Fi Connection Badge */}
      <View style={styles.wifiBadge}>
        <Ionicons name="wifi" size={16} color={Colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timerPill: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 12,
    lineHeight: 14,
  },
  timerSub: {
    fontSize: 8,
    color: Colors.gray600,
    marginTop: -2,
  },
  progressPill: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 9.5,
  },
  progressValue: {
    fontSize: 9.5,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.headerBlue,
  },
  cloudButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  wifiBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.recordedGreen,
    alignItems: "center",
    justifyContent: "center",
  },
});
