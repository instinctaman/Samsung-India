import React from "react";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type LeaderboardUser = {
  name: string;
  score: string;
  accuracy: string;
  isYou?: boolean;
};

export type LeaderboardRowProps = {
  user: LeaderboardUser;
};

export default function LeaderboardRow({ user }: LeaderboardRowProps) {
  const isYou = user.isYou || user.name.toUpperCase() === "YOU";

  return (
    <View style={[styles.row, isYou && styles.youRow]}>
      {/* Avatar */}
      <View style={[styles.avatar, isYou && styles.youAvatar]} />

      {/* Trainee Name */}
      <AppText
        style={[styles.name, isYou && styles.youName]}
        weight={isYou ? FontWeight.bold : FontWeight.semiBold}
        numberOfLines={1}
      >
        {user.name}
      </AppText>

      {/* Score and Accuracy */}
      <View style={styles.scoreContainer}>
        <AppText
          style={styles.scoreText}
          color={Colors.headerBlue}
          weight={FontWeight.bold}
        >
          {user.score}
        </AppText>
        <AppText style={styles.accuracyText}> ({user.accuracy})</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  youRow: {
    backgroundColor: "#EAF2FF",
    borderColor: "#BFDBFE",
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#DBEAFE",
    marginRight: 10,
  },
  youAvatar: {
    backgroundColor: "#93C5FD",
  },
  name: {
    flex: 1,
    fontSize: 12,
    color: "#1F2937",
    letterSpacing: 0.2,
  },
  youName: {
    color: "#1E3A8A",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 12,
  },
  accuracyText: {
    fontSize: 11,
    color: Colors.gray600,
  },
});
