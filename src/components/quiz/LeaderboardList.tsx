import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import LeaderboardRow, { LeaderboardUser } from "./LeaderboardRow";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type LeaderboardListProps = {
  users?: LeaderboardUser[];
  onViewAll?: () => void;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
};

export default function LeaderboardList({
  users,
  onViewAll,
  correctCount,
  totalQuestions,
  accuracy,
}: LeaderboardListProps) {
  const defaultUsers: LeaderboardUser[] = users ?? [
    {
      name: "PRIYANSHU BORA",
      score: `${totalQuestions}/${totalQuestions}`,
      accuracy: "100%",
    },
    {
      name: "ANKIT KUMAR",
      score: `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`,
      accuracy: `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`,
    },
    {
      name: "ANAND SINGH",
      score: `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`,
      accuracy: `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`,
    },
    {
      name: "AMEERUL HAQUE",
      score: `${Math.max(1, Math.floor(totalQuestions * 0.75))}/${totalQuestions}`,
      accuracy: `${Math.round((Math.floor(totalQuestions * 0.75) / totalQuestions) * 100)}%`,
    },
    {
      name: "YOU",
      score: `${correctCount}/${totalQuestions}`,
      accuracy: `${accuracy}%`,
      isYou: true,
    },
  ];


  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="trophy" size={16} color="#F59E0B" />
          <AppText style={styles.title} weight={FontWeight.bold}>
            GLOBAL TOP 5
          </AppText>
        </View>

        {onViewAll && (
          <Pressable
            onPress={onViewAll}
            hitSlop={8}
            style={styles.viewAllRow}
            accessibilityRole="button"
            accessibilityLabel="View All Rankings"
          >
            <AppText
              style={styles.viewAllText}
              color={Colors.headerBlue}
              weight={FontWeight.semiBold}
            >
              View All
            </AppText>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={Colors.headerBlue}
            />
          </Pressable>
        )}
      </View>

      {/* Rows */}
      <View style={styles.list}>
        {defaultUsers.map((user) => (
          <LeaderboardRow key={user.name} user={user} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 11,
    color: "#111827",
    letterSpacing: 0.5,
  },
  viewAllRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewAllText: {
    fontSize: 12,
  },
  list: {
    gap: 0,
  },
});
