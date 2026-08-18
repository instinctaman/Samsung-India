import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

type SessionButtonProps = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function SessionButton({
  title,
  onPress,
  backgroundColor = Colors.headerBlue,
  icon,
}: SessionButtonProps) {
  const handlePress = () => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      (document.activeElement as HTMLElement)?.blur?.();
      setTimeout(onPress, 10);
    } else {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.buttonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={Colors.white}
          style={styles.icon}
        />
      )}
      <AppText
        style={styles.text}
        color={Colors.white}
        weight={FontWeight.bold}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 42,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
});