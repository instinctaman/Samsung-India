import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { MONTH_NAMES } from "./calendarUtils";

type MonthSelectorProps = {
  currentMonth: number;
  currentYear: number;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
};

export default function MonthSelector({
  currentMonth,
  currentYear,
  onSelectMonth,
  onSelectYear,
}: MonthSelectorProps) {
  const [pickerMode, setPickerMode] = useState<"month" | "year" | null>(null);

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const close = () => setPickerMode(null);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.dropdownPill}
        onPress={() => setPickerMode((m) => (m === "month" ? null : "month"))}
        accessibilityRole="button"
        accessibilityLabel="Select month"
      >
        <Text style={styles.dropdownPillText}>{MONTH_NAMES[currentMonth]}</Text>
        <Ionicons name="chevron-down" size={12} color="#6B7280" />
      </Pressable>

      <Pressable
        style={styles.dropdownPill}
        onPress={() => setPickerMode((m) => (m === "year" ? null : "year"))}
        accessibilityRole="button"
        accessibilityLabel="Select year"
      >
        <Text style={styles.dropdownPillText}>{currentYear}</Text>
        <Ionicons name="chevron-down" size={12} color="#6B7280" />
      </Pressable>

      {pickerMode !== null && (
        <View style={styles.dropdownPanel} pointerEvents="box-none">
          <Pressable style={styles.dropdownBackdrop} onPress={close} />
          <View style={styles.dropdownCard}>
            <Text style={styles.modalTitle}>
              {pickerMode === "month" ? "Select Month" : "Select Year"}
            </Text>
            <ScrollView
              style={styles.modalList}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {pickerMode === "month" &&
                MONTH_NAMES.map((name, index) => {
                  const isSelected = currentMonth === index;
                  return (
                    <Pressable
                      key={name}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        onSelectMonth(index);
                        close();
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {name}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={Colors.mainColour1}
                        />
                      )}
                    </Pressable>
                  );
                })}

              {pickerMode === "year" &&
                years.map((year) => {
                  const isSelected = currentYear === year;
                  return (
                    <Pressable
                      key={year}
                      style={[
                        styles.modalOption,
                        isSelected && styles.modalOptionSelected,
                      ]}
                      onPress={() => {
                        onSelectYear(year);
                        close();
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          isSelected && styles.modalOptionTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={Colors.mainColour1}
                        />
                      )}
                    </Pressable>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 20,
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: "#D1D5DB",
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownPillText: {
    fontSize: 11,
    color: "#1F2937",
    fontWeight: "500",
  },
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
    top: 36,
    left: 0,
    right: 0,
    maxHeight: 280,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Shadows.raised,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalList: {
    maxHeight: 220,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  modalOptionSelected: {
    backgroundColor: "#EFF6FF",
  },
  modalOptionText: {
    fontSize: 13,
    color: "#374151",
  },
  modalOptionTextSelected: {
    color: Colors.mainColour1,
    fontWeight: "700",
  },
});
