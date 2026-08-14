import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import {
  DatePreset,
  DateRange,
  formatDisplayDate,
  formatMonthDay,
  rangeForPreset,
  startOfDay,
} from "./calendarUtils";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

type CalendarProps = {
  range: DateRange;
  preset?: DatePreset;
  defaultExpanded?: boolean;
  onApply: (range: DateRange, preset: DatePreset) => void;
};

export default function Calendar({
  range,
  preset = "custom",
  defaultExpanded = false,
  onApply,
}: CalendarProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [selectedStart, setSelectedStart] = useState<Date>(range.start);
  const [selectedEnd, setSelectedEnd] = useState<Date>(range.end);
  const [activePreset, setActivePreset] = useState<DatePreset>(preset);

  // Month & year for FROM calendar
  const [fromMonth, setFromMonth] = useState<number>(range.start.getMonth());
  const [fromYear, setFromYear] = useState<number>(range.start.getFullYear());

  // Month & year for TO calendar
  const [toMonth, setToMonth] = useState<number>(range.end.getMonth());
  const [toYear, setToYear] = useState<number>(range.end.getFullYear());

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handlePrevFromMonth = () => {
    if (fromMonth === 0) {
      setFromMonth(11);
      setFromYear((y) => y - 1);
    } else {
      setFromMonth((m) => m - 1);
    }
  };

  const handleNextFromMonth = () => {
    if (fromMonth === 11) {
      setFromMonth(0);
      setFromYear((y) => y + 1);
    } else {
      setFromMonth((m) => m + 1);
    }
  };

  const handlePrevToMonth = () => {
    if (toMonth === 0) {
      setToMonth(11);
      setToYear((y) => y - 1);
    } else {
      setToMonth((m) => m - 1);
    }
  };

  const handleNextToMonth = () => {
    if (toMonth === 11) {
      setToMonth(0);
      setToYear((y) => y + 1);
    } else {
      setToMonth((m) => m + 1);
    }
  };

  const handleSelectStartDate = (date: Date) => {
    const newStart = startOfDay(date);
    setSelectedStart(newStart);
    setActivePreset("custom");

    const newEnd =
      newStart.getTime() > selectedEnd.getTime() ? newStart : selectedEnd;
    if (newStart.getTime() > selectedEnd.getTime()) {
      setSelectedEnd(newStart);
    }

    onApply(
      {
        start: newStart,
        end: newEnd,
      },
      "custom"
    );
  };

  const handleSelectEndDate = (date: Date) => {
    const newEnd = startOfDay(date);
    setSelectedEnd(newEnd);
    setActivePreset("custom");

    const newStart =
      newEnd.getTime() < selectedStart.getTime() ? newEnd : selectedStart;
    if (newEnd.getTime() < selectedStart.getTime()) {
      setSelectedStart(newEnd);
    }

    onApply(
      {
        start: newStart,
        end: newEnd,
      },
      "custom"
    );
  };

  const handleFilterPress = () => {
    onApply(
      {
        start: selectedStart,
        end: selectedEnd,
      },
      activePreset
    );
    // Toggle expand state or keep updated
    setIsExpanded((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Top Filter Bar - Clicking datefield or filter opens/closes calendar */}
      <View style={styles.topFilterBar}>
        <Pressable
          style={styles.dateBox}
          onPress={handleToggleExpand}
          accessibilityRole="button"
          accessibilityLabel="Select Start Date"
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>
            {formatDisplayDate(selectedStart)}
          </Text>
        </Pressable>

        <Ionicons name="arrow-forward" size={15} color="#9CA3AF" />

        <Pressable
          style={styles.dateBox}
          onPress={handleToggleExpand}
          accessibilityRole="button"
          accessibilityLabel="Select End Date"
        >
          <Ionicons
            name="calendar-outline"
            size={15}
            color={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>
            {formatDisplayDate(selectedEnd)}
          </Text>
        </Pressable>

        <Pressable
          style={styles.filterButton}
          onPress={handleFilterPress}
          accessibilityRole="button"
          accessibilityLabel="Filter"
        >
          <Ionicons name="calendar-outline" size={15} color={Colors.white} />
          <Text style={styles.filterButtonText}>Filter</Text>
        </Pressable>
      </View>

      {/* Render Dual Calendar and Banner when Expanded */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Divider */}
          <View style={styles.divider} />

          {/* Side-by-side Dual Calendar Cards */}
          <View style={styles.calendarsRow}>
            {/* FROM Calendar Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>FROM :</Text>

              <CalendarHeader
                currentMonth={fromMonth}
                currentYear={fromYear}
                onPrevMonth={handlePrevFromMonth}
                onNextMonth={handleNextFromMonth}
                onSelectMonth={setFromMonth}
                onSelectYear={setFromYear}
              />

              <CalendarGrid
                year={fromYear}
                month={fromMonth}
                startDate={selectedStart}
                endDate={selectedEnd}
                onSelectDate={handleSelectStartDate}
              />

              <View style={styles.summaryBadge}>
                <Text style={styles.summaryLabel}>From Date</Text>
                <Text style={styles.summaryValue}>
                  {formatMonthDay(selectedStart)}
                </Text>
              </View>
            </View>

            {/* Center Blue Arrow */}
            <View style={styles.arrowContainer}>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={Colors.mainColour1}
              />
            </View>

            {/* TO Calendar Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>TO :</Text>

              <CalendarHeader
                currentMonth={toMonth}
                currentYear={toYear}
                onPrevMonth={handlePrevToMonth}
                onNextMonth={handleNextToMonth}
                onSelectMonth={setToMonth}
                onSelectYear={setToYear}
              />

              <CalendarGrid
                year={toYear}
                month={toMonth}
                startDate={selectedStart}
                endDate={selectedEnd}
                onSelectDate={handleSelectEndDate}
              />

              <View style={styles.summaryBadge}>
                <Text style={styles.summaryLabel}>To Date</Text>
                <Text style={styles.summaryValue}>
                  {formatMonthDay(selectedEnd)}
                </Text>
              </View>
            </View>
          </View>

          {/* Summary Info Notice Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="information" size={14} color={Colors.white} />
            </View>
            <Text style={styles.infoText}>
              Showing data from{" "}
              <Text style={styles.infoHighlight}>
                {formatMonthDay(selectedStart)}
              </Text>{" "}
              to{" "}
              <Text style={styles.infoHighlight}>
                {formatMonthDay(selectedEnd)}
              </Text>
              .
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    ...Shadows.card,
  },
  topFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
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
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.mainColour1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterButtonText: {
    fontSize: 11.5,
    color: Colors.white,
    fontWeight: "700",
  },
  expandedContent: {
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAECF0",
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 2,
  },
  calendarsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  arrowContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryBadge: {
    marginTop: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  summaryLabel: {
    fontSize: 9.5,
    color: "#374151",
  },
  summaryValue: {
    fontSize: 10.5,
    color: Colors.mainColour1,
    fontWeight: "700",
  },
  infoBanner: {
    marginTop: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    fontSize: 11.5,
    color: "#1F2937",
    lineHeight: 16,
  },
  infoHighlight: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});