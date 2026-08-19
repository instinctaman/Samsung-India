import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { createShadow } from "@/theme/shadows";
import LeaderboardRow, { LeaderboardUser } from "./LeaderboardRow";
import LeaderboardFilter, { LeaderboardFilterValues } from "./LeaderboardFilter";

export type LeaderboardListProps = {
  title?: string;
  users?: LeaderboardUser[];
  onViewAll?: () => void;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  onApplyFilter?: (filters: LeaderboardFilterValues) => void;
};

export default function LeaderboardList({
  title = "GLOBAL TOP 100",
  users,
  onViewAll,
  correctCount,
  totalQuestions,
  accuracy,
  onApplyFilter,
}: LeaderboardListProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<LeaderboardFilterValues>({
    trainingType: "CLASSROOM TRAINING",
    state: "DELHI",
    district: "NEW DELHI",
    zone: "SOUTH",
  });

  const defaultUsers: LeaderboardUser[] = users ?? [
    {
      name: "You",
      score: `${correctCount}/${totalQuestions}`,
      accuracy: `${accuracy}%`,
      isYou: true,
    },
    {
      name: "Priyanshu Bora",
      score: `${totalQuestions}/${totalQuestions}`,
      accuracy: "100%",
    },
    {
      name: "Ankit Kumar",
      score: `${totalQuestions}/${totalQuestions}`,
      accuracy: "100%",
    },
    {
      name: "Anand Singh",
      score: `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`,
      accuracy: `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`,
    },
    {
      name: "Ameerul Haque",
      score: `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`,
      accuracy: `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`,
    },
    {
      name: "Priyanshu Bora",
      score: `${totalQuestions}/${totalQuestions}`,
      accuracy: "100%",
    },
    {
      name: "Ankit Kumar",
      score: `${totalQuestions}/${totalQuestions}`,
      accuracy: "100%",
    },
    {
      name: "Anand Singh",
      score: `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`,
      accuracy: `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`,
    },
    {
      name: "Ameerul Haque",
      score: `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`,
      accuracy: `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`,
    },
  ];

  const handleApply = () => {
    onApplyFilter?.(filterValues);
    setFilterOpen(false);
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="trophy" size={16} color="#F59E0B" />
          <AppText style={styles.title} weight={FontWeight.bold}>
            {title}
          </AppText>
        </View>

        <Pressable
          style={styles.filterBtn}
          onPress={() => setFilterOpen(!filterOpen)}
          accessibilityRole="button"
          accessibilityLabel="Toggle Leaderboard Filter"
        >
          <AppText
            style={styles.filterBtnText}
            color={Colors.headerBlue}
            weight={FontWeight.semiBold}
          >
            {filterOpen ? "Close" : "Filter"}
          </AppText>
          <Ionicons
            name={filterOpen ? "chevron-down" : "chevron-forward"}
            size={13}
            color={Colors.headerBlue}
          />
        </Pressable>
      </View>

      {/* Expandable / Collapsible Filter Section */}
      {filterOpen && (
        <LeaderboardFilter
          values={filterValues}
          onChangeValues={setFilterValues}
          onApply={handleApply}
        />
      )}

      {/* Leaderboard Rows */}
      <View style={styles.list}>
        {defaultUsers.map((user, idx) => (
          <LeaderboardRow
            key={`${user.name}-${user.score}-${idx}`}
            user={user}
          />
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
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.06, elevation: 2 }),
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
    fontSize: 12,
    color: "#1E293B",
    letterSpacing: 0.4,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  filterBtnText: {
    fontSize: 12,
  },
  list: {
    gap: 0,
  },
});
