import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { TopPerformer } from "./sessionDashboardTypes";

type TopPerformersCardProps = {
  performers?: TopPerformer[];
  hasStarted?: boolean;
};

const DEFAULT_PERFORMERS: TopPerformer[] = [
  { id: "1", name: "PRAMODHB BORI", score: 50, maxScore: 50, percentage: 100 },
  { id: "2", name: "AMRIT KUMAR", score: 48, maxScore: 50, percentage: 96 },
  { id: "3", name: "ANAND SINGH", score: 46, maxScore: 50, percentage: 92 },
  { id: "4", name: "AMLESH THAKUR", score: 45, maxScore: 50, percentage: 90 },
  { id: "5", name: "PRAMODHB BORI", score: 45, maxScore: 50, percentage: 90 },
];

export default function TopPerformersCard({
  performers = DEFAULT_PERFORMERS,
  hasStarted = true,
}: TopPerformersCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.crownEmoji}>👑</Text>
          <Text style={styles.title}>TOP PERFORMERS</Text>
        </View>

        {hasStarted && (
          <Pressable
            style={styles.toggleBtn}
            onPress={() => setIsCollapsed((prev) => !prev)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={isCollapsed ? "View More" : "View Less"}
          >
            <Text style={styles.toggleText}>
              {isCollapsed ? "View More" : "View Less"}
            </Text>
            <Ionicons
              name={isCollapsed ? "chevron-down" : "chevron-forward"}
              size={13}
              color="#0066FF"
            />
          </Pressable>
        )}
      </View>

      {/* Empty State */}
      {!hasStarted && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTrophy}>🏆</Text>
          <Text style={styles.emptyTitle}>Leaderboard Empty</Text>
          <Text style={styles.emptySubtitle}>
            Scores will appear here as participants finish quizzes
          </Text>
        </View>
      )}

      {/* List */}
      {hasStarted && !isCollapsed && (
        <View style={styles.list}>
          {performers.map((performer, index) => (
            <View key={`${performer.id}-${index}`} style={styles.performerRow}>
              <View style={styles.leftInfo}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={13} color="#8B5CF6" />
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {performer.name}
                </Text>
              </View>

              <Text style={styles.scoreText}>
                {performer.score}/{performer.maxScore}{" "}
                <Text style={styles.percentageText}>
                  [{performer.percentage}%]
                </Text>
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    marginHorizontal: 14,
    marginTop: 10,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  crownEmoji: {
    fontSize: 14,
  },
  title: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
  },
  toggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  toggleText: {
    fontSize: 11.5,
    color: "#0066FF",
    fontWeight: "700",
  },
  list: {
    gap: 6,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 18,
    gap: 4,
  },
  emptyTrophy: {
    fontSize: 32,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  performerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0066FF",
  },
  percentageText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
  },
});
