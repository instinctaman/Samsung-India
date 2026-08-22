import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import { Colors } from "@/theme/colors";
import { FontFamily } from "@/theme/fontFamily";
import { FontSize, FontWeight } from "@/theme/typography";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

interface AppInputProps extends TextInputProps {
  label?: string;
  caption?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function AppInput({
  label,
  caption,
  icon,
  style,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="label" weight={FontWeight.medium} color={Colors.black} style={styles.label}>
          {label}
        </AppText>
      )}

      <View style={styles.inputRow}>
        {icon && <Ionicons name={icon} size={16} color={Colors.gray600} style={styles.icon} />}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, props.editable === false && styles.inputDisabled, style]}
          placeholderTextColor={Colors.gray400}
          {...props}
        />
      </View>

      {caption && (
        <AppText variant="overline" color={Colors.gray600} style={styles.caption}>
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
    marginBottom: Spacing.sm,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    position: "absolute",
    left: Spacing.lg,
    zIndex: 1,
  },

  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.bodySmall,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.regular,
    includeFontPadding: false,
  },

  inputWithIcon: {
    paddingLeft: Spacing.lg + 16 + 8,
  },

  inputDisabled: {
    backgroundColor: Colors.gray100,
    color: Colors.gray600,
  },

  caption: {
    marginTop: Spacing.sm,
  },
});
