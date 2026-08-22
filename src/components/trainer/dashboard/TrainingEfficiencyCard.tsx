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
  const size = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Percentage calculations
  const executedPercent =
    stats.executedPercentage > 0 ? stats.executedPercentage : 30;
  const pendingPercent =
    stats.pendingPercentage > 0 ? stats.pendingPercentage : 70;

  const blueDash = (circumference * pendingPercent) / 100;
  const greenDash = (circumference * executedPercent) / 100;

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

      {/* Content: Donut Chart + Middle Divider + Stats */}
      <View style={styles.contentRow}>
        {/* Donut Chart */}
        <View style={styles.chartWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Blue Arc (Pending) - 70% */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#0066FF"
              strokeWidth={strokeWidth}
              strokeDasharray={`${blueDash} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              fill="none"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
            {/* Green Arc (Executed) - 30% */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#00BA5D"
              strokeWidth={strokeWidth}
              strokeDasharray={`${greenDash} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="butt"
              fill="none"
              transform={`rotate(${
                (pendingPercent / 100) * 360 - 90
              } ${size / 2} ${size / 2})`}
            />
          </Svg>

          <View style={styles.chartCenterText}>
            <Text style={styles.centerLabel}>Total Sessions</Text>
            <Text style={styles.centerValue}>{stats.totalSessions || 30}</Text>
          </View>
        </View>

        {/* Middle Vertical Divider Line */}
        <View style={styles.verticalDivider} />

        {/* Breakdown Progress Bars */}
        <View style={styles.statsColumn}>
          {/* Executed Section */}
          <View style={styles.statItem}>
            <View style={styles.statHeader}>
              <View style={styles.statLabelRow}>
                <View style={[styles.dot, { backgroundColor: "#00BA5D" }]} />
                <Text style={styles.statLabel}>Executed</Text>
              </View>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.executedValue}>
                {stats.completed || 4}{" "}
                <Text style={styles.executedPercentText}>
                  ({executedPercent}%)
                </Text>
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${executedPercent}%`,
                    backgroundColor: "#00BA5D",
                  },
                ]}
              />
            </View>
          </View>

          {/* Pending Section */}
          <View style={[styles.statItem, { marginTop: 12 }]}>
            <View style={styles.statHeader}>
              <View style={styles.statLabelRow}>
                <View style={[styles.dot, { backgroundColor: "#0066FF" }]} />
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.pendingValue}>
                {stats.pending || 26}{" "}
                <Text style={styles.pendingPercentText}>
                  ({pendingPercent}%)
                </Text>
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${pendingPercent}%`,
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
    padding: 15,
    marginHorizontal: 10,
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
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
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
    justifyContent: "flex-start",
  },
  chartWrapper: {
    flex: 1,
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  chartCenterText: {
    position: "absolute",
    width: 108,
    height: 108,
    alignItems: "center",
    justifyContent: "center",
  },
  centerValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  centerLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#111827",
  },
  verticalDivider: {
    width: 2,
    height: 80,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 15,
  },
  statsColumn: {
    flex: 1,
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
    fontSize: 10,
    fontWeight: "600",
    color: "#111827",
  },
  valueRow: {
    marginTop: 2,
    marginBottom: 4,
  },
  executedValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00BA5D",
  },
  executedPercentText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#00BA5D",
  },
  pendingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0066FF",
  },
  pendingPercentText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#0066FF",
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
