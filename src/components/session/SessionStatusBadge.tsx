import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

type Props = {
  label: string;
  live?: boolean;
  completed?: boolean;
  missed?: boolean;
};

export default function SessionStatusBadge({
  label,
  live = false,
  completed = false,
  missed = false,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        live && styles.liveContainer,
        completed && styles.completedContainer,
        missed && styles.missedContainer,
      ]}
    >
      {completed && (
        <Ionicons
          name="checkmark-circle"
          size={10}
          color={Colors.success}
        />
      )}
      {missed && (
        <Ionicons
          name="close-circle"
          size={10}
          color={Colors.danger}
        />
      )}

      <AppText
        style={[
          styles.text,
          live && styles.liveText,
          completed && styles.completedText,
          missed && styles.missedText,
        ]}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },

  liveContainer: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },

  completedContainer: {
    borderColor: Colors.success,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  missedContainer: {
    borderColor: Colors.danger,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  text: {
    fontSize: Fonts.overline,
    color: Colors.primary,
  },

  liveText: {
    color: Colors.white,
  },

  completedText: {
    color: Colors.success,
  },

  missedText: {
    color: Colors.danger,
  },
});