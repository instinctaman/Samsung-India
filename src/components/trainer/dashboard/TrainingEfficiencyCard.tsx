import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { DashboardStats } from "./dashboardUtils";

type TrainingEfficiencyCardProps = {
  stats: DashboardStats;
  onOverviewPress?: () => void;
};

export default function TrainingEfficiencyCard({
  stats,
  onOverviewPress,
}: TrainingEfficiencyCardProps) {
  const size = 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Percentage calculations
  const executedPercent =
    stats.totalSessions > 0 ? stats.executedPercentage : 70;
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
          <Ionicons name="chevron-down" size={11} color="#4B5563" />
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
          <View style={[styles.statItem, { marginTop: 10 }]}>
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
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    marginHorizontal: 12,
    marginTop: 10,
    ...Shadows.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  overviewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: Colors.white,
  },
  overviewText: {
    fontSize: 10,
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
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },
  centerLabel: {
    fontSize: 7.5,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.4,
    marginTop: 1,
  },
  statsColumn: {
    flex: 1,
    marginLeft: 14,
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
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#111827",
  },
  valueRow: {
    marginTop: 1,
    marginBottom: 3,
  },
  executedValue: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#10B981",
  },
  pendingValue: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0066FF",
  },
  percentageText: {
    fontSize: 11,
    fontWeight: "500",
  },
  progressBarTrack: {
    height: 4.5,
    backgroundColor: "#F3F4F6",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 4.5,
    borderRadius: 2.5,
  },
});
