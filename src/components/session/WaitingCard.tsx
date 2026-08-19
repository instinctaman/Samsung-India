import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

type WaitingCardProps = {
  title?: string;
  subtitle?: string;
  color?: string;
  backgroundColor?: string;
};

export default function WaitingCard({
  title = "Please Wait",
  subtitle = "Trainer will unlock soon...",
  color = Colors.headerBlue,
  backgroundColor = Colors.waitingBlueBg,
}: WaitingCardProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons
        name="hourglass-outline"
        size={24}
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
    backgroundColor: Colors.waitingBlueBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  textWrap: {
    gap: 1,
  },
  title: {
    fontSize: 13.5,
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 11.5,
  },
});