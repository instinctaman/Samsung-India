import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

type SessionButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function SessionButton({
  title,
  onPress,
  backgroundColor,
  icon,
}: SessionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
        },
      ]}
    >
      {icon && <Ionicons name={icon} size={16} color={Colors.white} style={styles.icon} />}
      <AppText
        style={styles.text}
        color={Colors.white}
        weight={FontWeight.medium}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    paddingVertical:2,
  },
  icon: {
    marginRight: 6,
  },

  text: {
    fontSize: Fonts.body,
  },
});