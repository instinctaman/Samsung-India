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
import { FontWeight } from "@/theme/fontWeight";

interface AppInputProps extends TextInputProps {
  label?: string;
}

export default function AppInput({
  label,
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
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    width: "100%",
    marginBottom: 18,
  },

  label: {
    fontSize: Fonts.lg,
    color: Colors.black,
    marginBottom: 8,
    fontWeight: "500",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: Fonts.sm,
    backgroundColor: Colors.white,
    fontWeight: FontWeight.regular,
    // borderColor: focused
    //   ? Colors.mainColour1
    //   : Colors.gray200
  },

});