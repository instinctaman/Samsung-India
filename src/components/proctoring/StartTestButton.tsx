import React from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type StartTestButtonProps = {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function StartTestButton({
  title = "I'm ready, Start Test",
  onPress,
  disabled = false,
  loading = false,
}: StartTestButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        (disabled || loading) && styles.disabledButton,
      ]}
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <>
          <Ionicons
            name="shield-checkmark-outline"
            size={20}
            color={Colors.white}
          />
          <AppText
            style={styles.buttonText}
            color={Colors.white}
            weight={FontWeight.bold}
          >
            {title}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#00A859",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    shadowColor: "#00A859",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
