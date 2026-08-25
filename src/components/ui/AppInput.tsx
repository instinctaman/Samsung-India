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
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/typography";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

interface AppInputProps extends TextInputProps {
  label?: string;
  caption?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  // Smaller height/padding for tight layouts like dense multi-field forms.
  compact?: boolean;
}

export default function AppInput({
  label,
  caption,
  icon,
  compact = false,
  style,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.container}>
      {label && (
        <AppText size={Fonts.body} weight={FontWeight.medium} color={Colors.black} style={styles.label}>
          {label}
        </AppText>
      )}

      <View style={styles.inputRow}>
        {icon && <Ionicons name={icon} size={compact ? 14 : 16} color={Colors.gray600} style={styles.icon} />}
        <TextInput
          style={[
            styles.input,
            compact && styles.inputCompact,
            icon && styles.inputWithIcon,
            props.editable === false && styles.inputDisabled,
            style,
          ]}
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
    fontSize: Fonts.body,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.regular,
    includeFontPadding: false,
  },

  inputCompact: {
    height: 38,
    paddingHorizontal: Spacing.md,
    fontSize: Fonts.xs,
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
