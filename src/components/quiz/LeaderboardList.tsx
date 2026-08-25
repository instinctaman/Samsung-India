import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { createShadow } from "@/theme/shadows";
import { buildMockLeaderboardUsers } from "./buildMockLeaderboardUsers";
import LeaderboardFilter, { LeaderboardFilterValues } from "./LeaderboardFilter";
import LeaderboardRow, { LeaderboardUser } from "./LeaderboardRow";

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
  title = "Global Top 100",
  users,
  correctCount,
  totalQuestions,
  accuracy,
  onApplyFilter,
}: LeaderboardListProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<LeaderboardFilterValues>({
    trainingType: "Classroom Training",
    state: "Delhi",
    district: "New Delhi",
    zone: "South",
  });

  const defaultUsers: LeaderboardUser[] = users ?? buildMockLeaderboardUsers(correctCount, totalQuestions, accuracy);

  const handleApply = () => {
    onApplyFilter?.(filterValues);
    setFilterOpen(false);
  };

  return (
    <View style={styles.card}>
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
          <AppText style={styles.filterBtnText} color={Colors.headerBlue} weight={FontWeight.semiBold}>
            {filterOpen ? "Close" : "Filter"}
          </AppText>
          <Ionicons name={filterOpen ? "chevron-down" : "chevron-forward"} size={13} color={Colors.headerBlue} />
        </Pressable>
      </View>

      {filterOpen && <LeaderboardFilter values={filterValues} onChangeValues={setFilterValues} onApply={handleApply} />}

      <View style={styles.list}>
        {defaultUsers.map((user, idx) => (
          <LeaderboardRow key={`${user.name}-${user.score}-${idx}`} user={user} position={idx + 1} />
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
