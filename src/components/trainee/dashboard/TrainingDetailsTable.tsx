import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { FontWeight } from "@/theme/typography";

export type TrainingRowData = {
  id: string;
  status: "Present" | "Absent" | "Scheduled";
  date: string;
  day: string;
  postTestScore?: string;
  postTestTrend?: "up" | "down" | "none";
  quizScore?: string;
  quizTrend?: "up" | "down" | "none";
  ranking?: string;
  rankingScope?: "Global" | "State";
  isLiveOrScheduled?: boolean;
};

export type TrainingDetailsTableProps = {
  trainings?: TrainingRowData[];
  onJoinSession?: () => void;
  onViewReport?: (id: string) => void;
  onViewAll?: () => void;
};

const DEFAULT_TRAININGS: TrainingRowData[] = [
  {
    id: "1",
    status: "Present",
    date: "21 May 2025",
    day: "(Wed)",
    postTestScore: "85/100",
    postTestTrend: "up",
    quizScore: "70/100",
    quizTrend: "up",
    ranking: "#120",
    rankingScope: "Global",
  },
  {
    id: "2",
    status: "Absent",
    date: "18 May 2025",
    day: "(Sun)",
    postTestScore: "60/100",
    postTestTrend: "down",
    quizScore: "50/100",
    quizTrend: "down",
    ranking: "#210",
    rankingScope: "Global",
  },
  {
    id: "3",
    status: "Scheduled",
    date: "25 May 2025",
    day: "(Sun)",
    postTestScore: "-",
    postTestTrend: "none",
    quizScore: "-",
    quizTrend: "none",
    ranking: "-",
    isLiveOrScheduled: true,
  },
  {
    id: "4",
    status: "Present",
    date: "14 May 2025",
    day: "(Wed)",
    postTestScore: "92/100",
    postTestTrend: "up",
    quizScore: "88/100",
    quizTrend: "up",
    ranking: "#95",
    rankingScope: "State",
  },
  {
    id: "5",
    status: "Present",
    date: "10 May 2025",
    day: "(Sat)",
    postTestScore: "78/100",
    postTestTrend: "up",
    quizScore: "65/100",
    quizTrend: "up",
    ranking: "#160",
    rankingScope: "Global",
  },
];

export default function TrainingDetailsTable({
  trainings = DEFAULT_TRAININGS,
  onJoinSession,
  onViewReport,
  onViewAll,
}: TrainingDetailsTableProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tableCard}>
        {/* Card Header with Icon, Title, and View All */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.clipboardBadge}>
              <Ionicons name="document-text" size={17} color="#2563EB" />
            </View>
            <AppText
              variant="body"
              weight={FontWeight.bold}
              color="#111827"
              style={styles.sectionTitle}
            >
              Training Details
            </AppText>
          </View>

          <Pressable
            style={styles.viewAllBtn}
            onPress={onViewAll}
            accessibilityRole="button"
            accessibilityLabel="View all training details"
          >
            <AppText variant="caption" weight={FontWeight.bold} color="#2563EB">
              View All
            </AppText>
            <Ionicons name="chevron-forward" size={14} color="#2563EB" />
          </Pressable>
        </View>

        {/* Horizontally Scrollable Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {/* Table Header Row */}
            <View style={styles.headerRow}>
              <View style={[styles.cell, styles.statusCol]}>
                <AppText
                  variant="caption"
                  weight={FontWeight.bold}
                  color="#374151"
                >
                  Status
                </AppText>
              </View>
              <View style={[styles.cell, styles.dateCol]}>
                <AppText
                  variant="caption"
                  weight={FontWeight.bold}
                  color="#374151"
                >
                  Date
                </AppText>
              </View>
              <View style={[styles.cell, styles.scoreCol, styles.centerAlign]}>
                <AppText
                  variant="caption"
                  weight={FontWeight.bold}
                  color="#374151"
                  style={styles.centerText}
                >
                  Post Test
                </AppText>
              </View>
              <View style={[styles.cell, styles.scoreCol, styles.centerAlign]}>
                <AppText
                  variant="caption"
                  weight={FontWeight.bold}
                  color="#374151"
                  style={styles.centerText}
                >
                  Quiz
                </AppText>
                <AppText
                  variant="tiny"
                  color="#6B7280"
                  style={styles.centerText}
                >
                  (Score / Gain)
                </AppText>
              </View>
              <View style={[styles.cell, styles.rankCol, styles.centerAlign]}>
                <AppText
                  variant="caption"
                  weight={FontWeight.bold}
                  color="#374151"
                  style={styles.centerText}
                >
                  Ranking
                </AppText>
              </View>
              <View style={[styles.cell, styles.reportCol, styles.centerAlign]}>
                <AppText
                  variant="caption"
                  weight={FontWeight.bold}
                  color="#374151"
                  style={styles.centerText}
                >
                  Report
                </AppText>
              </View>
            </View>

            {/* Table Body Rows */}
            {trainings.map((row) => (
              <View key={row.id} style={styles.dataRow}>
                {/* Status Pill */}
                <View style={[styles.cell, styles.statusCol]}>
                  <View
                    style={[
                      styles.statusPill,
                      row.status === "Present" && styles.presentPill,
                      row.status === "Absent" && styles.absentPill,
                      row.status === "Scheduled" && styles.scheduledPill,
                    ]}
                  >
                    <Ionicons
                      name={
                        row.status === "Present"
                          ? "checkmark-circle-outline"
                          : row.status === "Absent"
                            ? "close-circle-outline"
                            : "time-outline"
                      }
                      size={15}
                      color={
                        row.status === "Present"
                          ? "#059669"
                          : row.status === "Absent"
                            ? "#DC2626"
                            : "#EA580C"
                      }
                    />
                    <AppText
                      variant="caption"
                      weight={FontWeight.bold}
                      color={
                        row.status === "Present"
                          ? "#059669"
                          : row.status === "Absent"
                            ? "#DC2626"
                            : "#EA580C"
                      }
                    >
                      {row.status}
                    </AppText>
                  </View>
                </View>

                {/* Date */}
                <View style={[styles.cell, styles.dateCol]}>
                  <View style={styles.dateWrap}>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#1E3A8A"
                    />
                    <View>
                      <AppText
                        variant="caption"
                        weight={FontWeight.bold}
                        color="#1F2937"
                      >
                        {row.date}
                      </AppText>
                      <AppText variant="tiny" color="#6B7280">
                        {row.day}
                      </AppText>
                    </View>
                  </View>
                </View>

                {/* Post Test Score / Gain */}
                <View
                  style={[styles.cell, styles.scoreCol, styles.centerAlign]}
                >
                  {row.postTestScore === "-" ? (
                    <AppText variant="caption" color="#9CA3AF">
                      -
                    </AppText>
                  ) : (
                    <View style={styles.scoreWithTrend}>
                      <AppText
                        variant="caption"
                        weight={FontWeight.bold}
                        color={
                          row.postTestTrend === "up" ? "#16A34A" : "#DC2626"
                        }
                      >
                        {row.postTestScore?.split("/")[0]}
                      </AppText>
                      <AppText variant="tiny" color="#6B7280">
                        /{row.postTestScore?.split("/")[1]}
                      </AppText>
                      <Ionicons
                        name={
                          row.postTestTrend === "up"
                            ? "trending-up"
                            : "trending-down"
                        }
                        size={15}
                        color={
                          row.postTestTrend === "up" ? "#16A34A" : "#DC2626"
                        }
                        style={styles.trendIcon}
                      />
                    </View>
                  )}
                </View>

                {/* Quiz Score / Gain */}
                <View
                  style={[styles.cell, styles.scoreCol, styles.centerAlign]}
                >
                  {row.quizScore === "-" ? (
                    <AppText variant="caption" color="#9CA3AF">
                      -
                    </AppText>
                  ) : (
                    <View style={styles.scoreWithTrend}>
                      <AppText
                        variant="caption"
                        weight={FontWeight.bold}
                        color={row.quizTrend === "up" ? "#16A34A" : "#DC2626"}
                      >
                        {row.quizScore?.split("/")[0]}
                      </AppText>
                      <AppText variant="tiny" color="#6B7280">
                        /{row.quizScore?.split("/")[1]}
                      </AppText>
                      <Ionicons
                        name={
                          row.quizTrend === "up"
                            ? "trending-up"
                            : "trending-down"
                        }
                        size={15}
                        color={row.quizTrend === "up" ? "#16A34A" : "#DC2626"}
                        style={styles.trendIcon}
                      />
                    </View>
                  )}
                </View>

                {/* Ranking */}
                <View style={[styles.cell, styles.rankCol, styles.centerAlign]}>
                  {row.ranking === "-" ? (
                    <AppText variant="caption" color="#9CA3AF">
                      -
                    </AppText>
                  ) : (
                    <View style={styles.centerAlign}>
                      <AppText
                        variant="caption"
                        weight={FontWeight.bold}
                        color="#111827"
                      >
                        {row.ranking}
                      </AppText>
                      {row.rankingScope && (
                        <AppText variant="tiny" color="#6B7280">
                          {row.rankingScope}
                        </AppText>
                      )}
                    </View>
                  )}
                </View>

                {/* Report Action Column */}
                <View
                  style={[styles.cell, styles.reportCol, styles.centerAlign]}
                >
                  {row.status === "Scheduled" ? (
                    <Pressable
                      style={styles.joinBtn}
                      onPress={onJoinSession}
                      accessibilityRole="button"
                      accessibilityLabel="Join Session"
                    >
                      <Ionicons
                        name="play-circle-outline"
                        size={14}
                        color={Colors.white}
                      />
                      <AppText
                        variant="caption"
                        color={Colors.white}
                        weight={FontWeight.bold}
                      >
                        Join
                      </AppText>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.viewReportBtn}
                      onPress={() => onViewReport?.(row.id)}
                      accessibilityRole="button"
                      accessibilityLabel="View Report"
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={15}
                        color="#4F46E5"
                      />
                      <AppText
                        variant="caption"
                        color="#4F46E5"
                        weight={FontWeight.bold}
                      >
                        View
                      </AppText>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 28,
  },
  tableCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: Colors.white,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clipboardBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#FBFBFC",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingVertical: 12,
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingVertical: 16,
    alignItems: "center",
  },
  cell: {
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  statusCol: { width: 120 },
  dateCol: { width: 140 },
  scoreCol: { width: 120 },
  rankCol: { width: 100 },
  reportCol: { width: 100 },
  centerText: { textAlign: "center" },
  centerAlign: { alignItems: "center", justifyContent: "center" },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    alignSelf: "flex-start",
  },
  presentPill: {
    backgroundColor: "#ECFDF5",
  },
  absentPill: {
    backgroundColor: "#FEF2F2",
  },
  scheduledPill: {
    backgroundColor: "#FFF7ED",
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scoreWithTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  trendIcon: {
    marginLeft: 4,
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.card,
  },
  viewReportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.card,
  },
});
