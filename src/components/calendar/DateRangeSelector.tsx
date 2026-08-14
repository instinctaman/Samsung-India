import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { DatePreset, formatDisplayDate } from "./calendarUtils";

type DateRangeSelectorProps = {
  startDate: Date;
  endDate: Date;
  preset: DatePreset;
  onOpenDateDrop: () => void;
};

const PRESET_LABEL_MAP: Record<DatePreset, string> = {
  today: "Today",
  this_month: "This Month",
  last_7: "Last 7 Days",
  last_30: "Last 30 Days",
  custom: "Custom",
};

export default function DateRangeSelector({
  startDate,
  endDate,
  preset,
  onOpenDateDrop,
}: DateRangeSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          style={styles.dateBox}
          onPress={onOpenDateDrop}
          accessibilityRole="button"
          accessibilityLabel="Start Date"
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>{formatDisplayDate(startDate)}</Text>
        </Pressable>

        <Ionicons name="arrow-forward" size={16} color={Colors.gray400} />

        <Pressable
          style={styles.dateBox}
          onPress={onOpenDateDrop}
          accessibilityRole="button"
          accessibilityLabel="End Date"
        >
          <Ionicons
            name="calendar-outline"
            size={16}
            color={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>{formatDisplayDate(endDate)}</Text>
        </Pressable>

        <Pressable
          style={styles.presetButton}
          onPress={onOpenDateDrop}
          accessibilityRole="button"
          accessibilityLabel="Date Preset"
        >
          <Ionicons name="calendar-outline" size={16} color={Colors.white} />
          <Text style={styles.presetButtonText}>
            {PRESET_LABEL_MAP[preset] ?? "This Month"}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    borderRadius: Radius.lg,
    paddingHorizontal: 8,
    paddingVertical: 9,
    ...Shadows.card,
  },
  dateBoxText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  presetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...Shadows.card,
  },
  presetButtonText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: "600",
  },
});
