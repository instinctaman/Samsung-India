import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

type RecordedCardProps = {
  title: string;
  subtitle: string;
  color: string;
  backgroundColor?: string;
};

export default function RecordedCard({
  title,
  subtitle,
  color,
  backgroundColor = "#D8F8EB",
}: RecordedCardProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <Ionicons
        name="checkmark-circle"
        size={18}
        color={color}
      />

      <View>
        <AppText
          style={styles.title}
          color={color}
          weight={FontWeight.medium}
        >
          {title}
        </AppText>

        <AppText
          style={styles.subtitle}
          color={color}
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
    gap: 7,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 7,
  },

  title: {
    fontSize: Fonts.body,
  },

  subtitle: {
    fontSize: Fonts.bodySm,
  },
});
