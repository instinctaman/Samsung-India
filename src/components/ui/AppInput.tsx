import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TextInputProps,
} from "react-native";

import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontFamily } from "@/theme/fontFamily";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";

interface AppInputProps extends TextInputProps {
  label?: string;
  caption?: string;
}

export default function AppInput({
  label,
  caption,
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

      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
        placeholderTextColor={Colors.gray400}
        {...props}
      />

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

  input: {
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

  caption: {
    fontSize: Fonts.overline,
    color: Colors.gray600,
    marginTop: Spacing.sm,
    fontFamily: FontFamily.regular,
  },

});
