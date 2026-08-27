import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/theme/colors";
import CalendarGrid from "../CalendarGrid";
import CalendarHeader from "../CalendarHeader";
import { formatMonthDay } from "../calendarUtils";
import { useMonthYear } from "./useMonthYear";

type MonthCardProps = {
  title: string;
  summaryLabel: string;
  monthYear: ReturnType<typeof useMonthYear>;
  selectedStart: Date;
  selectedEnd: Date;
  summaryDate: Date;
  onSelectDate: (date: Date) => void;
  onClear: () => void;
  isDateDisabled?: (date: Date) => boolean;
};

export default function MonthCard({
  title,
  summaryLabel,
  monthYear,
  selectedStart,
  selectedEnd,
  summaryDate,
  onSelectDate,
  onClear,
  isDateDisabled,
}: MonthCardProps) {
  const { month, year, setMonth, setYear, prevMonth, nextMonth } = monthYear;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Pressable onPress={onClear} hitSlop={6}>
          <Text style={styles.clearText}>Clear</Text>
        </Pressable>
      </View>

      <CalendarHeader
        currentMonth={month}
        currentYear={year}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onSelectMonth={setMonth}
        onSelectYear={setYear}
      />

      <CalendarGrid
        year={year}
        month={month}
        startDate={selectedStart}
        endDate={selectedEnd}
        onSelectDate={onSelectDate}
        isDateDisabled={isDateDisabled}
      />

      <View style={styles.summaryBadge}>
        <Text style={styles.summaryLabel}>{summaryLabel}</Text>
        <Text style={styles.summaryValue}>{formatMonthDay(summaryDate)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAECF0",
    padding: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 8.5,
    fontWeight: "600",
    color: Colors.mainColour1,
  },
  summaryBadge: {
    marginTop: 6,
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingVertical: 3.5,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#374151",
  },
  summaryValue: {
    fontSize: 8.5,
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});
