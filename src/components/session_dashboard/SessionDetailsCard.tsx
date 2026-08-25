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
  conferenceStatus?: string;
  hasStarted?: boolean;
};

function getStatusPresentation(isClosed: boolean): { label: string; bg: string; color: string } {
  return isClosed
    ? { label: "Session Closed", bg: "#111827", color: Colors.white }
    : { label: "Scheduled", bg: "#111827", color: Colors.white };
}

export default function SessionDetailsCard({
  topic = "Webinar",
  date = "20 Jul 2026",
  trainerName = "Demo Trainer",
  runtime = "Runtime : 02h 31m",
  conferenceStatus = "Ongoing",
  hasStarted = true,
}: SessionDetailsCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isClosed = conferenceStatus.toLowerCase() === "completed";
  const showStatusRow = isClosed || !hasStarted;
  const statusPresentation = getStatusPresentation(isClosed);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.infoIconCircle}>
            <Ionicons name="information" size={14} color={Colors.white} />
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
                  size={16}
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
                  size={16}
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
                  size={16}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.label}>Trainer</Text>
            </View>
            <Text style={[styles.value, styles.trainerValue]}>
              {trainerName}
            </Text>
          </View>

          {/* Row 4: Status — shown before the session has been started
              (Scheduled) and once it's actually closed (Session Closed) */}
          {showStatusRow && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <View style={styles.leftCol}>
                  <View style={styles.iconBox}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#0066FF" />
                  </View>
                  <Text style={styles.label}>Status</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: statusPresentation.bg }]}>
                  <Text style={[styles.statusPillText, { color: statusPresentation.color }]}>
                    {statusPresentation.label}
                  </Text>
                </View>
              </View>
            </>
          )}

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
    marginTop: 8,
    overflow: "hidden",
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0066FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
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
    fontSize: 11,
    color: "#0066FF",
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
  },
  value: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "500",
  },
  trainerValue: {
    color: "#0066FF",
    fontWeight: "700",
  },
  statusPill: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAECF0",
    marginVertical: 2,
  },
  bottomPillWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  runtimePill: {
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  runtimeText: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "600",
  },
});
