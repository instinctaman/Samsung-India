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

function formatName(name: string): string {
  if (!name) return "";
  if (name.toUpperCase() === "YOU") return "You";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function LeaderboardRow({ user }: LeaderboardRowProps) {
  const isYou = Boolean(user.isYou || user.name.toUpperCase() === "YOU");
  const displayName = formatName(user.name);

  return (
    <View style={[styles.row, isYou && styles.youRow]}>
      {/* Avatar Placeholder */}
      <View style={[styles.avatar, isYou && styles.youAvatar]} />

      {/* Trainee Name */}
      <AppText
        style={[styles.name, isYou && styles.youName]}
        weight={isYou ? FontWeight.bold : FontWeight.semiBold}
        numberOfLines={1}
      >
        {displayName}
      </AppText>

      {/* Score & Accuracy */}
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
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  youRow: {
    backgroundColor: "#DCEBFE",
    borderColor: "#BFDBFE",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    marginRight: 12,
  },
  youAvatar: {
    backgroundColor: "#C2DCFF",
  },
  name: {
    flex: 1,
    fontSize: 13,
    color: "#1E293B",
    letterSpacing: 0.2,
  },
  youName: {
    color: "#0F172A",
    fontSize: 13.5,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 13,
  },
  accuracyText: {
    fontSize: 12,
    color: "#64748B",
  },
});
