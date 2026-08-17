import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { LiveStudioQuestion } from "./sessionDashboardTypes";

type LiveStudioCardProps = {
  questions?: LiveStudioQuestion[];
  onBroadcast?: (questionId: string) => void;
  onLaunchNext?: () => void;
  onStopTimer?: () => void;
  onLeaderboard?: () => void;
  onLock?: () => void;
};

const DEFAULT_QUESTIONS: LiveStudioQuestion[] = [
  {
    id: "4",
    qNumber: "Q4",
    timerSecs: 45,
    questionText: "[AR] Identify the INCORRECT device feature in live demo of Galaxy A55 5G.",
  },
  {
    id: "7",
    qNumber: "Q7",
    timerSecs: 45,
    questionText: "[AR] Identify the dimension / specs in live demo of Galaxy A35 5G.",
  },
  {
    id: "8",
    qNumber: "Q8",
    timerSecs: 45,
    questionText: "[AR] Identify the CORRECT features in live demo of Galaxy A55 5G.",
  },
  {
    id: "9",
    qNumber: "Q9",
    timerSecs: 45,
    questionText: "[AR] Identify the INCORRECT device in live demo of Galaxy A35 5G.",
  },
  {
    id: "10",
    qNumber: "Q10",
    timerSecs: 45,
    questionText: "[AR] Identify the INCORRECT display in live demo of Galaxy A55 5G.",
  },
];

export default function LiveStudioCard({
  questions = DEFAULT_QUESTIONS,
  onBroadcast,
  onLaunchNext,
  onStopTimer,
  onLeaderboard,
  onLock,
}: LiveStudioCardProps) {
  const [broadcastedIds, setBroadcastedIds] = useState<Record<string, boolean>>(
    {}
  );

  const handleBroadcastClick = (id: string) => {
    setBroadcastedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    onBroadcast?.(id);
  };

  return (
    <View style={styles.card}>
      {/* Blue Top Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="volume-high" size={15} color={Colors.white} />
          <Text style={styles.headerTitle}>LIVE STUDIO</Text>
        </View>

        <View style={styles.headerBadgesRow}>
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>80 TOTAL Q</Text>
          </View>
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>24 DISPLAY</Text>
          </View>
          <View style={styles.headerGreenPill}>
            <Text style={styles.headerGreenPillText}>✓ 7 ACTIVATED</Text>
          </View>
        </View>
      </View>

      {/* 3 Metric Summary Boxes */}
      <View style={styles.summaryBoxesRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>STATE</Text>
          <Text style={[styles.summaryBoxValue, { color: "#2563EB" }]}>
            CLOSED
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>ACTIVE Q ID</Text>
          <Text style={styles.summaryBoxValue}>0</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>RESPONSES</Text>
          <Text style={[styles.summaryBoxValue, { color: "#10B981" }]}>
            10
          </Text>
        </View>
      </View>

      {/* Questions List */}
      <View style={styles.questionsList}>
        {questions.map((q) => {
          const isSent = broadcastedIds[q.id];
          return (
            <View key={q.id} style={styles.questionRow}>
              <View style={styles.qBadgesCol}>
                <View style={styles.qNumPill}>
                  <Text style={styles.qNumText}>{q.qNumber}</Text>
                </View>
                <View style={styles.qTimerPill}>
                  <Ionicons name="time-outline" size={8} color="#2563EB" />
                  <Text style={styles.qTimerText}>{q.timerSecs} Secs</Text>
                </View>
              </View>

              <Text style={styles.qText} numberOfLines={2}>
                {q.questionText}
              </Text>

              <Pressable
                style={[
                  styles.broadcastBtn,
                  isSent && styles.broadcastBtnActive,
                ]}
                onPress={() => handleBroadcastClick(q.id)}
              >
                <Ionicons
                  name={isSent ? "checkmark-circle" : "send"}
                  size={10}
                  color={Colors.white}
                />
                <Text style={styles.broadcastBtnText}>
                  {isSent ? "Active" : "Broadcast"}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Bottom 4 Studio Action Buttons */}
      <View style={styles.bottomActionsRow}>
        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#0066FF" }]}
          onPress={onLaunchNext}
        >
          <Ionicons name="play" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>LAUNCH NEXT</Text>
        </Pressable>

        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#EF4444" }]}
          onPress={onStopTimer}
        >
          <Ionicons name="stop" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>STOP TIMER</Text>
        </Pressable>

        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#F59E0B" }]}
          onPress={onLeaderboard}
        >
          <Ionicons name="trophy" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>LEADERBOARD</Text>
        </Pressable>

        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#374151" }]}
          onPress={onLock}
        >
          <Ionicons name="lock-closed" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>LOCK</Text>
        </Pressable>
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
    overflow: "hidden",
    marginHorizontal: 14,
    marginTop: 10,
    ...Shadows.card,
  },
  headerBanner: {
    backgroundColor: "#0066FF",
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 11.5,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  headerBadgesRow: {
    flexDirection: "row",
    gap: 4,
  },
  headerPill: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  headerPillText: {
    fontSize: 7.5,
    color: Colors.white,
    fontWeight: "700",
  },
  headerGreenPill: {
    backgroundColor: "#10B981",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  headerGreenPillText: {
    fontSize: 7.5,
    color: Colors.white,
    fontWeight: "700",
  },
  summaryBoxesRow: {
    flexDirection: "row",
    gap: 6,
    padding: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  summaryBoxLabel: {
    fontSize: 7.5,
    fontWeight: "700",
    color: "#6B7280",
  },
  summaryBoxValue: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#111827",
    marginTop: 1,
  },
  questionsList: {
    paddingHorizontal: 10,
    gap: 5,
    marginBottom: 10,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 7,
    gap: 6,
  },
  qBadgesCol: {
    gap: 2,
    alignItems: "flex-start",
  },
  qNumPill: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  qNumText: {
    fontSize: 8,
    fontWeight: "800",
    color: Colors.white,
  },
  qTimerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  qTimerText: {
    fontSize: 7,
    fontWeight: "600",
    color: "#2563EB",
  },
  qText: {
    flex: 1,
    fontSize: 9,
    color: "#1F2937",
    fontWeight: "500",
    lineHeight: 12.5,
  },
  broadcastBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#0066FF",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  broadcastBtnActive: {
    backgroundColor: "#10B981",
  },
  broadcastBtnText: {
    fontSize: 8.5,
    fontWeight: "700",
    color: Colors.white,
  },
  bottomActionsRow: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  bottomBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bottomBtnText: {
    fontSize: 7.5,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.2,
  },
});
