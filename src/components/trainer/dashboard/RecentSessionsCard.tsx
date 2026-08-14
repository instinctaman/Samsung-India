import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { TrainingAgendaItem } from "@/api/training";
import {
  formatSessionTime,
  getSessionStatusInfo,
} from "./dashboardUtils";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type RecentSessionsCardProps = {
  sessions: TrainingAgendaItem[];
  onViewAll: () => void;
  onSelectSession: (conferenceUid: string) => void;
};

export default function RecentSessionsCard({
  sessions,
  onViewAll,
  onSelectSession,
}: RecentSessionsCardProps) {
  // If API returned sessions, use the latest 2; otherwise show default demo items matching the design
  const items =
    sessions.length > 0
      ? sessions.slice(0, 2)
      : [
          {
            conferenceUid: "demo-1",
            title: "Sales Training Program",
            conferenceDate: "2026-07-12",
            conferenceTime: "10:00 AM",
            conferenceStatus: "Completed" as const,
            approvalStatus: "Approved" as const,
            batchSize: "25",
          },
          {
            conferenceUid: "demo-2",
            title: "Product Knowledge",
            conferenceDate: "2026-07-10",
            conferenceTime: "02:00 PM",
            conferenceStatus: "Ongoing" as const,
            approvalStatus: "Approved" as const,
            batchSize: "30",
          },
        ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recent Sessions</Text>
        <Pressable style={styles.viewAllPill} onPress={onViewAll} hitSlop={6}>
          <Text style={styles.viewAllText}>View All</Text>
        </Pressable>
      </View>

      {/* List */}
      <View style={styles.list}>
        {items.map((session, index) => {
          const statusInfo = getSessionStatusInfo(
            session.conferenceStatus === "Ongoing"
              ? "Ongoing"
              : session.conferenceStatus === "Completed"
              ? "Completed"
              : "Scheduled"
          );

          const isCompleted = index === 0 || session.conferenceStatus === "Completed";
          const iconBorder = isCompleted ? "#A7F3D0" : "#BFDBFE";
          const iconColor = isCompleted ? "#10B981" : "#0066FF";
          const iconBg = isCompleted ? "#ECFDF5" : "#EFF6FF";

          return (
            <View key={session.conferenceUid}>
              {index > 0 && <View style={styles.divider} />}
              <Pressable
                style={styles.itemRow}
                onPress={() => onSelectSession(session.conferenceUid)}
              >
                <View style={styles.itemContent}>
                  <View
                    style={[
                      styles.calendarBox,
                      { borderColor: iconBorder, backgroundColor: iconBg },
                    ]}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={iconColor}
                    />
                  </View>

                  <View style={styles.infoWrapper}>
                    <Text style={styles.sessionTitle} numberOfLines={1}>
                      {session.title || "Training Session"}
                    </Text>
                    <Text style={styles.sessionDateTime}>
                      {formatSessionTime(
                        session.conferenceDate,
                        session.conferenceTime
                      )}
                    </Text>
                  </View>
                </View>

                {/* Right aligned status badge at the bottom of the item */}
                <View style={styles.statusBadgeRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusInfo.bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: statusInfo.color },
                      ]}
                    >
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllPill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: Colors.white,
  },
  viewAllText: {
    fontSize: 9,
    color: "#4B5563",
    fontWeight: "500",
  },
  list: {
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 6,
  },
  itemRow: {
    paddingVertical: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  calendarBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoWrapper: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#111827",
  },
  sessionDateTime: {
    fontSize: 8,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadgeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: "600",
  },
});
