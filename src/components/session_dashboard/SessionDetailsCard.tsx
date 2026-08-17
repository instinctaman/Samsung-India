import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type SessionDetailsCardProps = {
  topic?: string;
  date?: string;
  trainerName?: string;
  runtime?: string;
};

export default function SessionDetailsCard({
  topic = "Webinar",
  date = "20 Jul 2026",
  trainerName = "Demo Trainer",
  runtime = "Runtime : 02h 31m",
}: SessionDetailsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.infoIconCircle}>
            <Ionicons name="information" size={18} color={Colors.white} />
          </View>
          <Text style={styles.title}>SESSION DETAILS</Text>
        </View>

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
            size={14}
            color="#0066FF"
          />
        </Pressable>
      </View>

      {!isCollapsed && (
        <View style={styles.content}>
          {/* Row 1: Topic */}
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.label}>Topic</Text>
            </View>
            <Text style={styles.value}>{topic}</Text>
          </View>

          <View style={styles.divider} />

          {/* Row 2: Date */}
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.label}>Date</Text>
            </View>
            <Text style={styles.value}>{date}</Text>
          </View>

          <View style={styles.divider} />

          {/* Row 3: Trainer */}
          <View style={styles.row}>
            <View style={styles.leftCol}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.label}>Trainer</Text>
            </View>
            <Text style={[styles.value, styles.trainerValue]}>
              {trainerName}
            </Text>
          </View>

          {/* Bottom Runtime Pill */}
          <View style={styles.bottomPillWrapper}>
            <View style={styles.runtimePill}>
              <Text style={styles.runtimeText}>{runtime}</Text>
            </View>
          </View>
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
    marginHorizontal: 14,
    marginTop: 10,
    overflow: "hidden",
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0066FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 13.5,
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
    fontSize: 12.5,
    color: "#0066FF",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 13.5,
    color: "#111827",
    fontWeight: "600",
  },
  value: {
    fontSize: 13.5,
    color: "#111827",
    fontWeight: "500",
  },
  trainerValue: {
    color: "#0066FF",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAECF0",
    marginVertical: 2,
  },
  bottomPillWrapper: {
    alignItems: "center",
    marginTop: 14,
  },
  runtimePill: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  runtimeText: {
    fontSize: 11.5,
    color: "#374151",
    fontWeight: "600",
  },
});
