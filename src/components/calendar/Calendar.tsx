import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CalenderIcon from "@/assets/images/svg/calender.svg";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import CalendarGrid from "./CalendarGrid";
import CalendarHeader from "./CalendarHeader";
import {
  DatePreset,
  DateRange,
  formatDisplayDate,
  formatMonthDay,
  startOfDay,
} from "./calendarUtils";

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
      "custom",
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
      "custom",
    );
  };

  const handleFilterPress = () => {
    onApply(
      {
        start: selectedStart,
        end: selectedEnd,
      },
      activePreset,
    );
    setIsExpanded((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* Top Filter Bar */}
      <View style={styles.topFilterBar}>
        <Pressable
          style={styles.dateBox}
          onPress={handleToggleExpand}
          accessibilityRole="button"
          accessibilityLabel="Select Start Date"
        >
          <CalenderIcon
            width={13}
            height={13}
            color={Colors.mainColour1}
            stroke={Colors.mainColour1}
          />
          <Text style={styles.dateBoxText}>
            {formatDisplayDate(selectedStart)}
          </Text>
        </Pressable>

        <Ionicons name="arrow-forward" size={13} color="#9CA3AF" />

        <Pressable
          style={styles.dateBox}
          onPress={handleToggleExpand}
          accessibilityRole="button"
          accessibilityLabel="Select End Date"
        >
          <CalenderIcon
            width={13}
            height={13}
            color={Colors.mainColour1}
            stroke={Colors.mainColour1}
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
          <CalenderIcon
            width={13}
            height={13}
            color={Colors.white}
            stroke={Colors.white}
          />
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
                size={14}
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
              <Ionicons name="information" size={11} color={Colors.white} />
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
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 10,
    marginHorizontal: 10,
    ...Shadows.card,
  },
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
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAECF0",
    padding: 4,
  },
  cardTitle: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.5,
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
  infoBanner: {
    marginTop: 8,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 9.5,
    color: "#1F2937",
    lineHeight: 13,
  },
  infoHighlight: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});
