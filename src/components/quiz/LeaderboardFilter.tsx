import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type LeaderboardFilterValues = {
  trainingType: string;
  state: string;
  district: string;
  zone: string;
};

export type LeaderboardFilterProps = {
  values: LeaderboardFilterValues;
  onChangeValues: (values: LeaderboardFilterValues) => void;
  onApply: () => void;
};

export default function LeaderboardFilter({
  values,
  onChangeValues,
  onApply,
}: LeaderboardFilterProps) {
  const updateField = (field: keyof LeaderboardFilterValues, val: string) => {
    onChangeValues({
      ...values,
      [field]: val,
    });
  };

  return (
    <View style={styles.filterSection}>
      {/* Training Type Input */}
      <View style={styles.fieldBlock}>
        <AppText style={styles.fieldLabel} weight={FontWeight.semiBold}>
          TRAINING TYPE :
        </AppText>
        <TextInput
          style={styles.fieldInput}
          value={values.trainingType}
          onChangeText={(t) => updateField("trainingType", t)}
          placeholder="CLASSROOM TRAINING"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
        />
      </View>

      {/* State & District Row */}
      <View style={styles.twoColRow}>
        <View style={styles.col}>
          <AppText style={styles.fieldLabel} weight={FontWeight.semiBold}>
            STATE :
          </AppText>
          <TextInput
            style={styles.fieldInput}
            value={values.state}
            onChangeText={(t) => updateField("state", t)}
            placeholder="DELHI"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.col}>
          <AppText style={styles.fieldLabel} weight={FontWeight.semiBold}>
            DISTRICT :
          </AppText>
          <TextInput
            style={styles.fieldInput}
            value={values.district}
            onChangeText={(t) => updateField("district", t)}
            placeholder="NEW DELHI"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
          />
        </View>
      </View>

      {/* Zone & Action Filter Button Row */}
      <View style={styles.twoColRow}>
        <View style={styles.col}>
          <AppText style={styles.fieldLabel} weight={FontWeight.semiBold}>
            ZONE :
          </AppText>
          <TextInput
            style={styles.fieldInput}
            value={values.zone}
            onChangeText={(t) => updateField("zone", t)}
            placeholder="SOUTH"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.col}>
          <Pressable
            style={styles.applyFilterButton}
            onPress={onApply}
            accessibilityRole="button"
            accessibilityLabel="Apply Filter"
          >
            <AppText
              style={styles.applyFilterButtonText}
              color={Colors.white}
              weight={FontWeight.bold}
            >
              FILTER
            </AppText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    backgroundColor: "#EEF5FF",
    borderColor: "#D3E4FF",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  fieldBlock: {
    marginBottom: 12,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "flex-end",
  },
  col: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#1E293B",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  fieldInput: {
    height: 44,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: "#1E293B",
    fontFamily: "Poppins-SemiBold",
    includeFontPadding: false,
  },
  applyFilterButton: {
    height: 44,
    backgroundColor: "#0066FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  applyFilterButtonText: {
    fontSize: 14.5,
    letterSpacing: 0.5,
  },
});
