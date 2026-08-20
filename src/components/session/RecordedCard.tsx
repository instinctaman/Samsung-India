import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

type RecordedCardProps = {
  title?: string;
  subtitle?: string;
  color?: string;
  backgroundColor?: string;
};

export default function RecordedCard({
  title = "Recorded",
  subtitle = "Good Job !",
  color = Colors.recordedGreen,
  backgroundColor = Colors.recordedGreenBg,
}: RecordedCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons
        name="checkmark-circle"
        size={26}
        color={color}
      />

      <View style={styles.textWrap}>
        <AppText
          style={[styles.title, { color }]}
          weight={FontWeight.bold}
        >
          {title}
        </AppText>

        <AppText
          style={[styles.subtitle, { color }]}
          weight={FontWeight.medium}
        >
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  textWrap: {
    gap: 1,
  },
  title: {
    fontSize: 12,
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 9,
  },
});

