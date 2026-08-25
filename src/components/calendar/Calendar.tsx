import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { DateRangeFilterBar, MonthCard, RangeInfoBanner, useMonthYear } from "./date-range";
import { DatePreset, DateRange, startOfDay } from "./calendarUtils";

type CalendarProps = {
  range: DateRange;
  preset?: DatePreset;
  defaultExpanded?: boolean;
  onApply: (range: DateRange, preset: DatePreset) => void;
};

export default function Calendar({ range, preset = "custom", defaultExpanded = false, onApply }: CalendarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedStart, setSelectedStart] = useState<Date>(range.start);
  const [selectedEnd, setSelectedEnd] = useState<Date>(range.end);
  const [activePreset, setActivePreset] = useState<DatePreset>(preset);

  const fromMonthYear = useMonthYear(range.start);
  const toMonthYear = useMonthYear(range.end);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleSelectStartDate = (date: Date) => {
    const newStart = startOfDay(date);
    setSelectedStart(newStart);
    setActivePreset("custom");

    const newEnd = newStart.getTime() > selectedEnd.getTime() ? newStart : selectedEnd;
    if (newStart.getTime() > selectedEnd.getTime()) {
      setSelectedEnd(newStart);
    }

    onApply({ start: newStart, end: newEnd }, "custom");
  };

  const handleSelectEndDate = (date: Date) => {
    const newEnd = startOfDay(date);
    setSelectedEnd(newEnd);
    setActivePreset("custom");

    const newStart = newEnd.getTime() < selectedStart.getTime() ? newEnd : selectedStart;
    if (newEnd.getTime() < selectedStart.getTime()) {
      setSelectedStart(newEnd);
    }

    onApply({ start: newStart, end: newEnd }, "custom");
  };

  const handleFilterPress = () => {
    onApply({ start: selectedStart, end: selectedEnd }, activePreset);
    setIsExpanded((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <DateRangeFilterBar
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
        onToggleExpand={handleToggleExpand}
        onFilterPress={handleFilterPress}
      />

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />

          <View style={styles.calendarsRow}>
            <MonthCard
              title="FROM :"
              summaryLabel="From Date"
              monthYear={fromMonthYear}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              summaryDate={selectedStart}
              onSelectDate={handleSelectStartDate}
            />

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={14} color={Colors.mainColour1} />
            </View>

            <MonthCard
              title="TO :"
              summaryLabel="To Date"
              monthYear={toMonthYear}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              summaryDate={selectedEnd}
              onSelectDate={handleSelectEndDate}
            />
          </View>

          <RangeInfoBanner selectedStart={selectedStart} selectedEnd={selectedEnd} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 10,
    marginHorizontal: 10,
    ...Shadows.card,
  },
  expandedContent: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAECF0",
    marginTop: 8,
    marginBottom: 6,
    marginHorizontal: 2,
  },
  calendarsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    width: 14,
  },
});
