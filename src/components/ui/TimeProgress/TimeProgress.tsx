import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";

import AppText from "../AppText";
import { Colors } from "@/theme/colors";
import { styles } from "./styles";

type Props = {
  totalMinutes: number;
  remainingMinutes: number;
  remainingSeconds: number;
  size?: number;
  strokeWidth?: number;
};

const TimeProgress = ({
  totalMinutes,
  remainingMinutes,
  remainingSeconds,
  size = 120,
  strokeWidth = 8,
}: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const totalSeconds = totalMinutes * 60;
  const remaining = remainingMinutes * 60 + remainingSeconds;

  const progress = remaining / totalSeconds;

  const dashOffset = circumference * (1 - progress);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFD8D8"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FF6B6B"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="time-outline"
            size={18}
            color="#2E2E2E"
          />
        </View>

        <AppText style={styles.time}>
          {String(remainingMinutes).padStart(2, "0")}:
          {String(remainingSeconds).padStart(2, "0")}
        </AppText>

        <AppText style={styles.label}>
          Time Left
        </AppText>
      </View>
    </View>
  );
};

export default TimeProgress;
