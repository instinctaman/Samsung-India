import { Pressable, StyleSheet, Text } from "react-native";
import { isToday } from "./calendarUtils";
import { Colors } from "@/theme/colors";

type CalendarDayProps = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  disabled?: boolean;
  onSelect: (date: Date) => void;
};

export default function CalendarDay({
  date,
  dayNumber,
  isCurrentMonth,
  isStart,
  isEnd,
  isInRange,
  disabled = false,
  onSelect,
}: CalendarDayProps) {
  const isSelected = isStart || isEnd;
  const isCurrentDay = isToday(date);

  return (
    <Pressable
      style={[
        styles.cell,
        isInRange && !isSelected && styles.cellInRange,
        isSelected && styles.cellSelected,
      ]}
      disabled={disabled}
      onPress={() => onSelect(date)}
    >
      <Text
        style={[
          styles.text,
          !isCurrentMonth && styles.textOutside,
          isInRange && !isSelected && styles.textInRange,
          isCurrentDay && !isSelected && styles.textToday,
          isSelected && styles.textSelected,
        ]}
      >
        {dayNumber}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 21,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 1.5,
    borderRadius: 5,
  },
  cellSelected: {
    backgroundColor: Colors.mainColour1,
  },
  cellInRange: {
    backgroundColor: "#EFF6FF",
  },
  text: {
    fontSize: 9.5,
    color: "#1F2937",
  },
  textSelected: {
    color: Colors.white,
    fontWeight: "700",
  },
  textInRange: {
    color: Colors.mainColour1,
    fontWeight: "600",
  },
  textOutside: {
    color: "#D1D5DB",
  },
  textToday: {
    fontWeight: "700",
    color: Colors.mainColour1,
  },
});
