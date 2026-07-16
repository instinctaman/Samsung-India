import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { Colors } from "@/theme/colors";

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
    borderRadius: 22,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
});