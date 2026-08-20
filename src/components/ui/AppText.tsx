import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

import { Colors } from "@/theme/colors";
import { FontFamily } from "@/theme/fontFamily";

type TextWeight =
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "light"
  | "regular"
  | "medium"
  | "semiBold"
  | "bold"
  | "extraBold"
  | "black";

const fontFamilyForWeight: Record<TextWeight, keyof typeof FontFamily> = {
  "300": "light",
  light: "light",
  "400": "regular",
  regular: "regular",
  "500": "medium",
  medium: "medium",
  "600": "semiBold",
  semiBold: "semiBold",
  "700": "bold",
  bold: "bold",
  "800": "extraBold",
  extraBold: "extraBold",
  "900": "black",
  black: "black",
};

interface AppTextProps extends TextProps {
  children?: React.ReactNode;
  size?: number;
  color?: string;
  weight?: TextWeight;
}

export default function AppText({
  children,
  size = 14,
  color = Colors.black,
  weight = "400",
  style,
  allowFontScaling = false,
  ...props
}: AppTextProps) {
  const selectedFamily =
    FontFamily[fontFamilyForWeight[weight]] || FontFamily.regular;

  return (
    <Text
      allowFontScaling={allowFontScaling}
      style={[
        styles.text,
        {
          fontSize: size,
          color,
          fontFamily: selectedFamily,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.regular,
    includeFontPadding: false,
  },
});
