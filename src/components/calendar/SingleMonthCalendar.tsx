import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import {
  DateRange,
  MONTH_NAMES,
  WEEKDAYS,
  generateMonthGrid,
  isBetweenDates,
  isSameDay,
  startOfDay,
} from "./calendarUtils";

type SingleMonthCalendarProps = {
  startDate: Date;
  endDate: Date;
  onSelectRange: (range: DateRange) => void;
  onClose?: () => void;
};

export default function SingleMonthCalendar({
  startDate,
  endDate,
  onSelectRange,
  onClose,
}: SingleMonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<number>(
    startDate.getMonth(),
  );
  const [currentYear, setCurrentYear] = useState<number>(
    startDate.getFullYear(),
  );
  const [selectedStart, setSelectedStart] = useState<Date>(startDate);
  const [selectedEnd, setSelectedEnd] = useState<Date>(endDate);
  const [selectionStep, setSelectionStep] = useState<0 | 1>(0);

  // Month & Year Picker Dropdown Mode
  const [pickerMode, setPickerMode] = useState<"month" | "year" | null>(null);
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (date: Date) => {
    const day = startOfDay(date);

    if (selectionStep === 0) {
      setSelectedStart(day);
      setSelectedEnd(day);
      setSelectionStep(1);
      onSelectRange({ start: day, end: day });
    } else {
      let finalStart = selectedStart;
      let finalEnd = day;

      if (day.getTime() < selectedStart.getTime()) {
        finalStart = day;
        finalEnd = selectedStart;
      }

      setSelectedStart(finalStart);
      setSelectedEnd(finalEnd);
      setSelectionStep(0);
      onSelectRange({ start: finalStart, end: finalEnd });
    }
  };

  const days = generateMonthGrid(currentYear, currentMonth);

  return (
    <View style={styles.card}>
      {/* Header Row: Prev Arrow, Month Pill, Year Pill, Next Arrow */}
      <View style={styles.header}>
        <Pressable
          style={styles.navArrow}
          onPress={handlePrevMonth}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={16} color="#111827" />
        </Pressable>

        <View style={styles.selectorsRow}>
          {/* Month Selector Pill */}
          <Pressable
            style={styles.dropdownPill}
            onPress={() =>
              setPickerMode((m) => (m === "month" ? null : "month"))
            }
          >
            <Text style={styles.dropdownPillText}>
              {MONTH_NAMES[currentMonth]}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#111827" />
          </Pressable>

          {/* Year Selector Pill */}
          <Pressable
            style={styles.dropdownPill}
            onPress={() => setPickerMode((m) => (m === "year" ? null : "year"))}
          >
            <Text style={styles.dropdownPillText}>{currentYear}</Text>
            <Ionicons name="chevron-down" size={12} color="#111827" />
          </Pressable>
        </View>

        <Pressable
          style={styles.navArrow}
          onPress={handleNextMonth}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Ionicons name="chevron-forward" size={16} color="#111827" />
        </Pressable>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((weekday) => (
          <Text key={weekday} style={styles.weekdayLabel}>
            {weekday}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {days.map((item, index) => {
          const isStart = isSameDay(item.date, selectedStart);
          const isEnd = isSameDay(item.date, selectedEnd);
          const isSelected = isStart || isEnd;
          const inRange = isBetweenDates(item.date, selectedStart, selectedEnd);

          return (
            <Pressable
              key={`${item.date.toISOString()}-${index}`}
              style={[
                styles.cell,
                inRange && !isSelected && styles.cellInRange,
                isSelected && styles.cellSelected,
              ]}
              onPress={() => handleSelectDate(item.date)}
            >
              <Text
                style={[
                  styles.dayText,
                  !item.isCurrentMonth && styles.dayTextOutside,
                  inRange && !isSelected && styles.dayTextInRange,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {item.dayNumber}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Month / Year Picker Modal Overlay */}
      {pickerMode !== null && (
        <View style={styles.pickerOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPickerMode(null)}
          />
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>
              {pickerMode === "month" ? "Select Month" : "Select Year"}
            </Text>
            <View style={styles.pickerGrid}>
              {pickerMode === "month" &&
                MONTH_NAMES.map((name, idx) => (
                  <Pressable
                    key={name}
                    style={[
                      styles.pickerOption,
                      currentMonth === idx && styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setCurrentMonth(idx);
                      setPickerMode(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        currentMonth === idx && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {name}
                    </Text>
                  </Pressable>
                ))}

              {pickerMode === "year" &&
                years.map((yr) => (
                  <Pressable
                    key={yr}
                    style={[
                      styles.pickerOption,
                      currentYear === yr && styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setCurrentYear(yr);
                      setPickerMode(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        currentYear === yr && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {yr}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    paddingVertical: 14,
    paddingHorizontal: 12,
    ...Shadows.raised,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  navArrow: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  selectorsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dropdownPillText: {
    fontSize: 12.5,
    color: "#111827",
    fontWeight: "500",
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 6,
  },
  weekdayLabel: {
    width: 34,
    textAlign: "center",
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  cell: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2.5,
    borderRadius: 7,
  },
  cellSelected: {
    backgroundColor: "#262626",
  },
  cellInRange: {
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
  },
  dayText: {
    fontSize: 12.5,
    color: "#1F2937",
    fontWeight: "500",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextInRange: {
    color: "#111827",
    fontWeight: "500",
  },
  dayTextOutside: {
    color: "#C4C4C4",
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  pickerCard: {
    width: "85%",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 12,
    ...Shadows.raised,
  },
  pickerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  pickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    justifyContent: "center",
  },
  pickerOption: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    backgroundColor: "#F3F4F6",
  },
  pickerOptionSelected: {
    backgroundColor: Colors.mainColour1,
  },
  pickerOptionText: {
    fontSize: 11,
    color: "#374151",
  },
  pickerOptionTextSelected: {
    color: Colors.white,
    fontWeight: "700",
  },
});
