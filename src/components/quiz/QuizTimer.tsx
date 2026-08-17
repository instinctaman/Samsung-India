import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type QuizTimerProps = {
  duration?: number;
  remainingSeconds?: number;
  onComplete?: () => void;
  onTick?: (seconds: number) => void;
  size?: number;
  strokeWidth?: number;
  textColor?: string;
  borderColor?: string;
};

export default function QuizTimer({
  duration = 24,
  remainingSeconds,
  onComplete,
  onTick,
  size = 140,
  strokeWidth = 3.5,
  textColor = Colors.black,
  borderColor = "#3B82F6",
}: QuizTimerProps) {
  const [internalSeconds, setInternalSeconds] = useState(duration);

  // If controlled from parent via remainingSeconds, use that; otherwise use internal countdown
  const isControlled = typeof remainingSeconds === "number";
  const seconds = isControlled ? remainingSeconds : internalSeconds;

  useEffect(() => {
    if (isControlled) return;
    setInternalSeconds(duration);
  }, [duration, isControlled]);

  useEffect(() => {
    if (isControlled) return;

    if (internalSeconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setInternalSeconds((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [internalSeconds, isControlled, onComplete, onTick]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor,
        },
      ]}
      accessibilityRole="timer"
      accessibilityLabel={`${seconds} seconds remaining`}
    >
      <AppText
        style={[styles.timerText, { color: textColor }]}
        weight={FontWeight.medium}
      >
        {seconds}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  timerText: {
    fontSize: 50,
    lineHeight: 56,
  },
});

