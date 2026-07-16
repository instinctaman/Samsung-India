import React from "react";
import {
  Text,
  TextProps,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?:
    | "400"
    | "500"
    | "600"
    | "700";
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
          fontWeight: weight,
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