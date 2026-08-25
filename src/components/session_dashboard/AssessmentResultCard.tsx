import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type AssessmentResultCardProps = {
  passCount?: number;
  failCount?: number;
  passRate?: number;
  hasStarted?: boolean;
};

export default function AssessmentResultCard({
  passCount: passCountProp = 14,
  failCount: failCountProp = 4,
  passRate: passRateProp = 82,
  hasStarted = true,
}: AssessmentResultCardProps) {
  const passCount = hasStarted ? passCountProp : 0;
  const failCount = hasStarted ? failCountProp : 0;
  const passRate = hasStarted ? passRateProp : 0;
  const size = 96;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Green arc covers 75% of circle, blue arc covers top 25%
  const greenLength = circumference * 0.75;
  const blueLength = circumference * 0.25;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="time-outline" size={16} color={Colors.mainColour1} />
        <Text style={styles.title}>ASSESSMENT RESULT</Text>
      </View>

      {/* Content */}
      <View style={styles.contentRow}>
        {/* Left Circular Gauge */}
        <View style={styles.chartWrapper}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Green Segment */}
            {hasStarted && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#10B981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${greenLength} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(45 ${size / 2} ${size / 2})`}
              />
            )}
            {/* Blue Segment */}
            {hasStarted && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#0066FF"
                strokeWidth={strokeWidth}
                strokeDasharray={`${blueLength} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            )}
          </Svg>

          <View style={styles.chartCenter}>
            <Text style={styles.chartCenterText}>
              {hasStarted ? "100% PASS" : "0%"}
            </Text>
          </View>
        </View>

        {/* Right Metric Boxes */}
        <View style={styles.metricsColumn}>
          <View style={styles.topBoxesRow}>
            {/* PASS Box */}
            <View style={styles.passBox}>
              <Text style={styles.passLabel}>PASS</Text>
              <Text style={styles.passValue}>{passCount}</Text>
            </View>

            {/* FAIL Box */}
            <View style={styles.failBox}>
              <Text style={styles.failLabel}>FAIL</Text>
              <Text style={styles.failValue}>{failCount}</Text>
            </View>
          </View>

          {/* Pass Rate Badge */}
          <View style={styles.passRateBadge}>
            <Ionicons name="trending-up" size={13} color="#10B981" />
            <Text style={styles.passRateText}>Pass Rate : {passRate}%</Text>
          </View>
        </View>
      </View>
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
    gap: 6,
    marginBottom: 10,
  },
  title: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartWrapper: {
    position: "relative",
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#111827",
  },
  metricsColumn: {
    flex: 1,
    marginLeft: 14,
    gap: 8,
  },
  topBoxesRow: {
    flexDirection: "row",
    gap: 8,
  },
  passBox: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    borderWidth: 1.2,
    borderColor: "#A7F3D0",
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  passLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#10B981",
  },
  passValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginTop: 1,
  },
  failBox: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    borderWidth: 1.2,
    borderColor: "#FECACA",
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  failLabel: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#EF4444",
  },
  failValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginTop: 1,
  },
  passRateBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    paddingVertical: 5,
  },
  passRateText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
});
