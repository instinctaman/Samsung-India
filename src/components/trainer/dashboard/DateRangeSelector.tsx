import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  DatePreset,
  formatDisplayDate,
} from "./dashboardUtils";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

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
      <View style={styles.card}>
        <Pressable
          style={styles.dateBox}
          onPress={onOpenDateDrop}
          accessibilityRole="button"
          accessibilityLabel="Start Date"
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>
            {formatDisplayDate(startDate)}
          </Text>
        </Pressable>

        <Ionicons name="arrow-forward" size={15} color="#9CA3AF" />

        <Pressable
          style={styles.dateBox}
          onPress={onOpenDateDrop}
          accessibilityRole="button"
          accessibilityLabel="End Date"
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>
            {formatDisplayDate(endDate)}
          </Text>
        </Pressable>

        <Pressable
          style={styles.presetButton}
          onPress={onOpenDateDrop}
          accessibilityRole="button"
          accessibilityLabel="Date Preset"
        >
          <Ionicons name="calendar-outline" size={15} color={Colors.white} />
          <Text style={styles.presetButtonText}>
            {PRESET_LABEL_MAP[preset] ?? "This Month"}
          </Text>
          <Ionicons name="chevron-down" size={13} color={Colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 8,
    gap: 6,
    ...Shadows.card,
  },
  dateBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  dateBoxText: {
    fontSize: 11.5,
    color: "#374151",
    fontWeight: "500",
  },
  presetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: Colors.mainColour1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  presetButtonText: {
    fontSize: 11.5,
    color: Colors.white,
    fontWeight: "600",
  },
});
