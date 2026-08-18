import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
} from "react-native";

import AppText from "./AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontFamily } from "@/theme/fontFamily";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

interface AppInputProps extends TextInputProps {
  label?: string;
  caption?: string;
}

export default function AppInput({
  label,
  caption,
  style,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <AppText style={styles.label} weight={FontWeight.medium}>
          {label}
        </AppText>
      )}

      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.gray400}
        {...props}
      />

      {caption && (
        <AppText style={styles.caption}>
          {caption}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Fonts.body,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    fontSize: Fonts.xs,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.regular,
    includeFontPadding: false,
  },
  caption: {
    fontSize: Fonts.overline,
    color: Colors.gray600,
    marginTop: Spacing.sm,
  },
});
