import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CalenderIcon from "@/assets/images/svg/calender.svg";
import { Colors } from "@/theme/colors";
import { formatDisplayDate } from "../calendarUtils";

type DateRangeFilterBarProps = {
  selectedStart: Date;
  selectedEnd: Date;
  onToggleExpand: () => void;
  onFilterPress: () => void;
};

export default function DateRangeFilterBar({ selectedStart, selectedEnd, onToggleExpand, onFilterPress }: DateRangeFilterBarProps) {
  return (
    <View style={styles.topFilterBar}>
      <Pressable style={styles.dateBox} onPress={onToggleExpand} accessibilityRole="button" accessibilityLabel="Select Start Date">
        <CalenderIcon width={13} height={13} color={Colors.mainColour1} stroke={Colors.mainColour1} />
        <Text style={styles.dateBoxText}>{formatDisplayDate(selectedStart)}</Text>
      </Pressable>

      <Ionicons name="arrow-forward" size={13} color="#9CA3AF" />

      <Pressable style={styles.dateBox} onPress={onToggleExpand} accessibilityRole="button" accessibilityLabel="Select End Date">
        <CalenderIcon width={13} height={13} color={Colors.mainColour1} stroke={Colors.mainColour1} />
        <Text style={styles.dateBoxText}>{formatDisplayDate(selectedEnd)}</Text>
      </Pressable>

      <Pressable style={styles.filterButton} onPress={onFilterPress} accessibilityRole="button" accessibilityLabel="Filter">
        <CalenderIcon width={13} height={13} color={Colors.white} stroke={Colors.white} />
        <Text style={styles.filterButtonText}>Filter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  dateBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  dateBoxText: {
    fontSize: 9.5,
    color: "#374151",
    fontWeight: "500",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: Colors.mainColour1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterButtonText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: "700",
  },
});
