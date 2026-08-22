import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import CalendarIcon from "@/assets/images/svg/calender.svg";
import { TrainingAgendaItem } from "@/api/training";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { formatSessionTime, getSessionStatusInfo } from "./dashboardUtils";

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
                : "Scheduled",
          );

          const isCompleted =
            index === 0 || session.conferenceStatus === "Completed";
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
                    <CalendarIcon
                      width={14}
                      height={14}
                      color={iconColor}
                      stroke={iconColor}
                    />
                  </View>

                  <View style={styles.infoWrapper}>
                    <Text style={styles.sessionTitle} numberOfLines={1}>
                      {session.title || "Training Session"}
                    </Text>
                    <Text style={styles.sessionDateTime}>
                      {formatSessionTime(
                        session.conferenceDate,
                        session.conferenceTime,
                      )}
                    </Text>
                  </View>
                </View>

                {/* Status badge */}
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
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 8,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  viewAllPill: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    backgroundColor: Colors.white,
  },
  viewAllText: {
    fontSize: 8,
    color: "#4B5563",
    fontWeight: "500",
  },
  list: {
    gap: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
  itemRow: {
    paddingVertical: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  calendarBox: {
    width: 30,
    height: 30,
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
    fontSize: 9,
    color: "#6B7280",
    marginTop: 1,
  },
  statusBadgeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 7.5,
    fontWeight: "600",
  },
});
