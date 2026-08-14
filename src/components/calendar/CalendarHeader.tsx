import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import MonthSelector from "./MonthSelector";

type CalendarHeaderProps = {
  currentMonth: number;
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
};

export default function CalendarHeader({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
}: CalendarHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        style={styles.navArrow}
        onPress={onPrevMonth}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
      >
        <Ionicons name="chevron-back" size={16} color="#374151" />
      </Pressable>

      <MonthSelector
        currentMonth={currentMonth}
        currentYear={currentYear}
        onSelectMonth={onSelectMonth}
        onSelectYear={onSelectYear}
      />

      <Pressable
        style={styles.navArrow}
        onPress={onNextMonth}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Next month"
      >
        <Ionicons name="chevron-forward" size={16} color="#374151" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  navArrow: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
