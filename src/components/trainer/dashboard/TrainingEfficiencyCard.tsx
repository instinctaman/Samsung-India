import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import { DashboardStats } from "./dashboardUtils";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

type TrainingEfficiencyCardProps = {
  stats: DashboardStats;
  onOverviewPress?: () => void;
};

export default function TrainingEfficiencyCard({
  stats,
  onOverviewPress,
}: TrainingEfficiencyCardProps) {
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Percentage calculations
  const executedPercent = stats.totalSessions > 0 ? stats.executedPercentage : 70;
  const pendingPercent = 100 - executedPercent;

  const executedStrokeDashoffset =
    circumference - (circumference * executedPercent) / 100;
  const pendingStrokeDashoffset =
    circumference - (circumference * pendingPercent) / 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Training Efficiency</Text>
        <Pressable
          style={styles.overviewButton}
          onPress={onOverviewPress}
          hitSlop={6}
        >
          <Text style={styles.overviewText}>Overview</Text>
          <Ionicons name="chevron-down" size={13} color="#4B5563" />
        </Pressable>
      </View>

      {/* Content: Donut Chart + Stats */}
      <View style={styles.contentRow}>
        {/* Donut Chart */}
        <View style={styles.chartWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Executed (Green Arc) */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#10B981"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={executedStrokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* Pending (Blue Arc) */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#0066FF"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={pendingStrokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(${
                (executedPercent / 100) * 360 - 90
              } ${size / 2} ${size / 2})`}
            />
          </Svg>

          <View style={styles.chartCenterText}>
            <Text style={styles.centerValue}>{stats.totalSessions}</Text>
            <Text style={styles.centerLabel}>TOTAL SESSIONS</Text>
          </View>
        </View>

        {/* Breakdown Progress Bars */}
        <View style={styles.statsColumn}>
          {/* Executed Section */}
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <View style={styles.statLabelRow}>
                <View style={[styles.dot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.statLabel}>Executed</Text>
              </View>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.executedValue}>
                {stats.completed}{" "}
                <Text style={styles.percentageText}>
                  ({stats.executedPercentage}%)
                </Text>
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${stats.executedPercentage}%`,
                    backgroundColor: "#10B981",
                  },
                ]}
              />
            </View>
          </View>

          {/* Pending Section */}
          <View style={[styles.statItem, { marginTop: 14 }]}>
            <View style={styles.statHeader}>
              <View style={styles.statLabelRow}>
                <View style={[styles.dot, { backgroundColor: "#0066FF" }]} />
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.pendingValue}>
                {stats.pending}{" "}
                <Text style={styles.percentageText}>
                  ({stats.pendingPercentage}%)
                </Text>
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${stats.pendingPercentage}%`,
                    backgroundColor: "#0066FF",
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  overviewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.white,
  },
  overviewText: {
    fontSize: 11,
    color: "#374151",
    fontWeight: "500",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  centerLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  statsColumn: {
    flex: 1,
    marginLeft: 20,
    justifyContent: "center",
  },
  statItem: {},
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  valueRow: {
    marginTop: 2,
    marginBottom: 4,
  },
  executedValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
  },
  pendingValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0066FF",
  },
  percentageText: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressBarTrack: {
    height: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 5,
    borderRadius: 2.5,
  },
});
