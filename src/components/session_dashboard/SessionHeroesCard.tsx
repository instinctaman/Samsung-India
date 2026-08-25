import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type SessionHeroesCardProps = {
  onSelectQuizHero?: () => void;
  onSelectTestHero?: () => void;
  // Only reflects the completed Test Module Hero results once the session
  // itself is closed (i.e. opened via "Report"); otherwise shows the
  // original still-locked placeholder state.
  isSessionClosed?: boolean;
  hasStarted?: boolean;
};

export default function SessionHeroesCard({
  onSelectQuizHero,
  onSelectTestHero,
  isSessionClosed = false,
  hasStarted = true,
}: SessionHeroesCardProps) {
  const isStandby = !hasStarted && !isSessionClosed;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>SESSION HEROES</Text>

      {/* Hero Card 1: LIVE QUIZ HERO */}
      <Pressable
        style={styles.heroCard}
        onPress={onSelectQuizHero}
        accessibilityRole="button"
      >
        <View style={styles.cardHeader}>
          <View style={styles.leftTitleRow}>
            <View style={styles.rocketIconCircle}>
              <Ionicons name="rocket" size={18} color="#EF4444" />
            </View>
            <View>
              <Text style={styles.heroTitle}>LIVE QUIZ HERO</Text>
              <View style={styles.badgesRow}>
                {isStandby ? (
                  <View style={styles.darkBadge}>
                    <Text style={styles.darkBadgeText}>Standby</Text>
                  </View>
                ) : (
                  <View style={styles.redDotBadge}>
                    <View style={styles.redDot} />
                    <Text style={styles.redBadgeText}>200 TEST</Text>
                  </View>
                )}
                <View style={styles.greyBadge}>
                  <Text style={styles.greyBadgeText}>
                    {isStandby ? "0/0 Completed" : "COMPLETED"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>

        {/* 4 Metrics Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Modules</Text>
            <Text style={styles.metricValue}>{isStandby ? "0" : "01"}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Participants</Text>
            <Text style={styles.metricValue}>{isStandby ? "0" : "22"}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Average</Text>
            <Text style={styles.metricValue}>{isStandby ? "-" : "14"}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Best</Text>
            <Text style={styles.metricValue}>{isStandby ? "-" : "30"}</Text>
          </View>
        </View>
      </Pressable>

      {/* Hero Card 2: Test Module Hero */}
      <Pressable
        style={styles.heroCard}
        onPress={onSelectTestHero}
        accessibilityRole="button"
      >
        <View style={styles.cardHeader}>
          <View style={styles.leftTitleRow}>
            <View style={styles.clipboardIconCircle}>
              <Ionicons name="clipboard" size={18} color="#0066FF" />
            </View>
            <View>
              <Text style={styles.heroTitle}>Test Module Hero</Text>
              <View style={styles.badgesRow}>
                <View style={styles.darkBadge}>
                  <Text style={styles.darkBadgeText}>
                    {isSessionClosed || isStandby ? "Standby" : "LOCKED"}
                  </Text>
                </View>
                <View style={styles.greyBadge}>
                  <Text style={styles.greyBadgeText}>
                    {isSessionClosed || isStandby ? "0/1 Completed" : "COMPLETED"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>

        {/* 4 Metrics Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Modules</Text>
            <Text style={styles.metricValue}>{isStandby ? "1" : "01"}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Participants</Text>
            <Text style={styles.metricValue}>
              {isStandby ? "0" : isSessionClosed ? "20" : "-"}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Average</Text>
            <Text style={styles.metricValue}>
              {isStandby ? "-" : isSessionClosed ? "18" : "-"}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Best</Text>
            <Text style={styles.metricValue}>
              {isStandby ? "-" : isSessionClosed ? "28" : "-"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rocketIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  clipboardIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  redDotBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  redDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EF4444",
  },
  redBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#EF4444",
  },
  greyBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  greyBadgeText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#6B7280",
  },
  darkBadge: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  darkBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.white,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.gray50,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "500",
  },
  metricValue: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },
});
