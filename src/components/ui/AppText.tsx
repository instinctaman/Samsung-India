import React from "react";
import {
  Text,
  TextProps,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";
import { FontFamily } from "@/theme/fontFamily";

type TextWeight = "400" | "500" | "600" | "700" | "bold";

const fontFamilyForWeight: Record<TextWeight, keyof typeof FontFamily> = {
  "400": "regular",
  "500": "medium",
  "600": "semiBold",
  "700": "bold",
  bold: "bold",
};

interface AppTextProps extends TextProps {
  children: React.ReactNode;
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
    ...props

}: AppTextProps) {
    return (
      <Text
        style={[
        styles.text,
        {
          fontSize: size,
          color,
          fontFamily: FontFamily[fontFamilyForWeight[weight]],
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
    text:{
    
}

});
