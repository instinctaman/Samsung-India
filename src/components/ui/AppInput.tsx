import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontFamily } from "@/theme/fontFamily";
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
  ...props
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.container}>
      {
        label && (
          <Text style={styles.label}>
            {label}
          </Text>
        )
      }

      <View style={styles.inputRow}>
        {icon && <Ionicons name={icon} size={16} color={Colors.gray600} style={styles.icon} />}
        <TextInput
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, icon && styles.inputWithIcon, props.editable === false && styles.inputDisabled]}
          placeholderTextColor={Colors.gray400}
          {...props}
        />
      </View>

      {
        caption && (
          <Text style={styles.caption}>
            {caption}
          </Text>
        )
      }
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
    fontFamily: FontFamily.medium,
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
    fontSize: Fonts.xs,
    backgroundColor: Colors.white,
    fontFamily: FontFamily.regular,
    // borderColor: focused
    //   ? Colors.mainColour1
    //   : Colors.gray200
  },

  inputWithIcon: {
    paddingLeft: Spacing.lg + 16 + 8,
  },

  inputDisabled: {
    backgroundColor: Colors.gray100,
    color: Colors.gray600,
  },

  caption: {
    fontSize: Fonts.overline,
    color: Colors.gray600,
    marginTop: Spacing.sm,
    fontFamily: FontFamily.regular,
  },

});
