import { useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";

export type DateRange = { start: Date; end: Date };
export type DatePreset = "today" | "this_month" | "last_7" | "last_30" | "custom";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function rangeForPreset(preset: DatePreset, fallback: DateRange): DateRange {
  const today = startOfDay(new Date());
  switch (preset) {
    case "today":
      return { start: today, end: today };
    case "this_month":
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) };
    case "last_7":
      return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), end: today };
    case "last_30":
      return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29), end: today };
    default:
      return fallback;
  }
}

export const formatDMY = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "this_month", label: "This Month" },
  { key: "last_7", label: "Last 7 Days" },
  { key: "last_30", label: "Last 30 Days" },
];

type DateDropProps = {
  range: DateRange;
  preset: DatePreset;
  onApply: (range: DateRange, preset: DatePreset) => void;
};

export default function DateDrop({ range, preset, onApply }: DateDropProps) {
  const [customStart, setCustomStart] = useState(range.start);
  const [customEnd, setCustomEnd] = useState(range.end);
  const [openField, setOpenField] = useState<"start" | "end" | null>(null);

  const pickDate = (field: "start" | "end", value: Date) => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value,
        mode: "date",
        onValueChange: (_event, selected) => {
          if (!selected) return;
          if (field === "start") setCustomStart(startOfDay(selected));
          else setCustomEnd(startOfDay(selected));
        },
      });
    } else {
      setOpenField(field);
    }
  };

  const handleInlineChange = (field: "start" | "end", _event: unknown, selected?: Date) => {
    if (selected) {
      if (field === "start") setCustomStart(startOfDay(selected));
      else setCustomEnd(startOfDay(selected));
    }
  };

  return (
    <View style={styles.container}>
      {PRESETS.map((item) => {
        const active = preset === item.key;
        return (
          <Pressable
            key={item.key}
            style={styles.row}
            onPress={() => onApply(rangeForPreset(item.key, range), item.key)}
          >
            <AppText style={styles.rowLabel} weight={active ? FontWeight.medium : FontWeight.regular}>{item.label}</AppText>
            {active && <Ionicons name="checkmark" size={16} color={Colors.mainColour1} />}
          </Pressable>
        );
      })}

      <View style={styles.divider} />

      <AppText style={styles.customTitle} color={Colors.gray600}>Custom Range</AppText>

      <View style={styles.customRow}>
        <Pressable style={styles.dateField} onPress={() => pickDate("start", customStart)}>
          <Ionicons name="calendar-outline" size={14} color={Colors.gray600} />
          <AppText style={styles.dateFieldText}>{formatDMY(customStart)}</AppText>
        </Pressable>
        <AppText style={styles.arrow} color={Colors.gray600}>→</AppText>
        <Pressable style={styles.dateField} onPress={() => pickDate("end", customEnd)}>
          <Ionicons name="calendar-outline" size={14} color={Colors.gray600} />
          <AppText style={styles.dateFieldText}>{formatDMY(customEnd)}</AppText>
        </Pressable>
      </View>

      {Platform.OS === "ios" && openField && (
        <View style={styles.inlinePicker}>
          <DateTimePicker
            value={openField === "start" ? customStart : customEnd}
            mode="date"
            display="inline"
            onValueChange={(event, date) => handleInlineChange(openField, event, date)}
          />
          <Pressable style={styles.doneButton} onPress={() => setOpenField(null)}>
            <AppText style={styles.doneText} color={Colors.mainColour1} weight={FontWeight.medium}>Done</AppText>
          </Pressable>
        </View>
      )}

      <Pressable
        style={styles.applyButton}
        onPress={() => onApply({ start: customStart, end: customEnd }, "custom")}
      >
        <AppText color={Colors.white} weight={FontWeight.semiBold}>Apply</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 24 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 11 },
  rowLabel: { fontSize: Fonts.body },
  divider: { height: 1, backgroundColor: Colors.gray100, marginVertical: 8 },
  customTitle: { fontSize: Fonts.overline, letterSpacing: 0.5, marginBottom: 8 },
  customRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  dateFieldText: { fontSize: Fonts.bodySm },
  arrow: { fontSize: Fonts.body },
  inlinePicker: { marginTop: 8, alignItems: "flex-end" },
  doneButton: { paddingVertical: 6, paddingHorizontal: 4 },
  doneText: { fontSize: Fonts.bodySm },
  applyButton: {
    marginTop: 16,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
  },
});
