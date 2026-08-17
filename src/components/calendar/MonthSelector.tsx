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
        <Ionicons name="chevron-down" size={9} color="#6B7280" />
      </Pressable>

      <Pressable
        style={styles.dropdownPill}
        onPress={() => setPickerMode((m) => (m === "year" ? null : "year"))}
        accessibilityRole="button"
        accessibilityLabel="Select year"
      >
        <Text style={styles.dropdownPillText}>{currentYear}</Text>
        <Ionicons name="chevron-down" size={9} color="#6B7280" />
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
                          size={14}
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
                          size={14}
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
    gap: 3,
    zIndex: 20,
  },
  dropdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
  },
  dropdownPillText: {
    fontSize: 8.5,
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
