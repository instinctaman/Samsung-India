import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

interface AppCardProps extends ViewProps {
  variant?: "mainColour1" | "white";
}

export default function AppCard({
  style,
  children,
  variant = "white",
  ...props
}: AppCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            variant === "mainColour1"
              ? Colors.mainColour1
              : Colors.white,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xxl,
    ...Shadows.raised,
  },
});
