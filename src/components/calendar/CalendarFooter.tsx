import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  DatePreset,
  PRESETS,
  formatMonthDay,
} from "./calendarUtils";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

type CalendarFooterProps = {
  startDate: Date;
  endDate: Date;
  activePreset?: DatePreset;
  onSelectPreset: (preset: DatePreset) => void;
  onApply: () => void;
};

export default function CalendarFooter({
  startDate,
  endDate,
  activePreset,
  onSelectPreset,
  onApply,
}: CalendarFooterProps) {
  return (
    <View style={styles.container}>
      {/* Presets Quick Selector */}
      <View style={styles.presetsRow}>
        {PRESETS.map((preset) => {
          const isActive = activePreset === preset.key;
          return (
            <Pressable
              key={preset.key}
              style={[
                styles.presetPill,
                isActive && styles.presetPillActive,
              ]}
              onPress={() => onSelectPreset(preset.key)}
            >
              <Text
                style={[
                  styles.presetText,
                  isActive && styles.presetTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Info Notice Banner */}
      <View style={styles.infoBanner}>
        <View style={styles.infoIconCircle}>
          <Ionicons name="information" size={14} color={Colors.white} />
        </View>
        <Text style={styles.infoText}>
          Showing data from{" "}
          <Text style={styles.infoHighlight}>{formatMonthDay(startDate)}</Text>{" "}
          to <Text style={styles.infoHighlight}>{formatMonthDay(endDate)}</Text>.
        </Text>
      </View>

      {/* Apply Button */}
      <Pressable style={styles.applyButton} onPress={onApply}>
        <Text style={styles.applyButtonText}>Apply Range</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    gap: 10,
  },
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  presetPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  presetPillActive: {
    backgroundColor: Colors.mainColour1,
    borderColor: Colors.mainColour1,
  },
  presetText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
  presetTextActive: {
    color: Colors.white,
    fontWeight: "700",
  },
  infoBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: Radius.xl,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#1F2937",
    lineHeight: 16,
  },
  infoHighlight: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
  applyButton: {
    height: 42,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    ...Shadows.raised,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
