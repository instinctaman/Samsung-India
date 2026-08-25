import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { MONTH_NAMES } from "./calendarUtils";

type MonthYearPickerPanelProps = {
  pickerMode: "month" | "year";
  currentMonth: number;
  currentYear: number;
  years: number[];
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
  onClose: () => void;
};

export default function MonthYearPickerPanel({
  pickerMode,
  currentMonth,
  currentYear,
  years,
  onSelectMonth,
  onSelectYear,
  onClose,
}: MonthYearPickerPanelProps) {
  return (
    <View style={styles.dropdownPanel} pointerEvents="box-none">
      <Pressable style={styles.dropdownBackdrop} onPress={onClose} />
      <View style={styles.dropdownCard}>
        <Text style={styles.modalTitle}>{pickerMode === "month" ? "Select Month" : "Select Year"}</Text>
        <ScrollView style={styles.modalList} nestedScrollEnabled showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {pickerMode === "month" &&
            MONTH_NAMES.map((name, index) => {
              const isSelected = currentMonth === index;
              return (
                <Pressable
                  key={name}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    onSelectMonth(index);
                    onClose();
                  }}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>{name}</Text>
                  {isSelected && <Ionicons name="checkmark" size={14} color={Colors.mainColour1} />}
                </Pressable>
              );
            })}

          {pickerMode === "year" &&
            years.map((year) => {
              const isSelected = currentYear === year;
              return (
                <Pressable
                  key={year}
                  style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                  onPress={() => {
                    onSelectYear(year);
                    onClose();
                  }}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>{year}</Text>
                  {isSelected && <Ionicons name="checkmark" size={14} color={Colors.mainColour1} />}
                </Pressable>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownPanel: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    elevation: 100,
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  dropdownCard: {
    position: "absolute",
    top: 28,
    left: -20,
    right: -20,
    maxHeight: 220,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.raised,
  },
  modalTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  modalList: {
    maxHeight: 180,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
  modalOptionSelected: {
    backgroundColor: "#EFF6FF",
  },
  modalOptionText: {
    fontSize: 11,
    color: "#374151",
  },
  modalOptionTextSelected: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});
