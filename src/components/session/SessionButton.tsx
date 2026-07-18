import React from "react";
import { Pressable, StyleSheet } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

type SessionButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor: string;
};

export default function SessionButton({
  title,
  onPress,
  backgroundColor,
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 7,
    paddingVertical:2,
  },

  text: {
    fontSize: Fonts.body,
  },
});