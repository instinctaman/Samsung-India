import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { QuizSocketClient } from "@/services/quizSocket";
import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { LiveStudioQuestion } from "./sessionDashboardTypes";

type LiveStudioCardProps = {
  questions?: LiveStudioQuestion[];
  systemId?: string;
  isSystemLive?: boolean;
  conferenceUid?: string;
  trainerName?: string | null;
  onTestSound?: () => void;
  onBroadcast?: (questionId: string) => void;
  onLaunchNext?: () => void;
  onStopTimer?: () => void;
  onLeaderboard?: () => void;
  onLobby?: () => void;
};

const DEFAULT_QUESTIONS: LiveStudioQuestion[] = [
  {
    id: "4",
    qNumber: "Q1",
    timerSecs: 30,
    questionText: "What is Galaxy AI's primary photo-editing feature on Galaxy S24/S25 series?",
  },
  {
    id: "7",
    qNumber: "Q2",
    timerSecs: 30,
    questionText: "Which processor powers the Samsung Galaxy S24 Ultra in India?",
  },
  {
    id: "8",
    qNumber: "Q3",
    timerSecs: 30,
    questionText: "How many years of OS & security updates are guaranteed for Galaxy S24 series?",
  },
  {
    id: "9",
    qNumber: "Q4",
    timerSecs: 30,
    questionText: "Which feature allows instant Google search by drawing a circle on the screen?",
  },
  {
    id: "10",
    qNumber: "Q5",
    timerSecs: 30,
    questionText: "What is the peak brightness (in nits) of the Dynamic AMOLED 2X display on Galaxy S24 Ultra?",
  },
];

export default function LiveStudioCard({
  questions = DEFAULT_QUESTIONS,
  systemId = "AS5896215",
  isSystemLive = true,
  conferenceUid = "CONF25456581",
  trainerName = "Trainer",
  onTestSound,
  onBroadcast,
  onLaunchNext,
  onStopTimer,
  onLeaderboard,
  onLobby,
}: LiveStudioCardProps) {
  const [broadcastedId, setBroadcastedId] = useState<string | null>(null);
  const [activeQIndex, setActiveQIndex] = useState<number>(0);
  const [studioState, setStudioState] = useState<string>("LOBBY");
  const [connectedCount, setConnectedCount] = useState<number>(0);
  const [responseCount, setResponseCount] = useState<number>(0);
  const [optionCounts, setOptionCounts] = useState<Record<string, number>>({});
  const socketRef = useRef<QuizSocketClient | null>(null);

  useEffect(() => {
    if (!conferenceUid) return;

    const socket = new QuizSocketClient(conferenceUid, "trainer", trainerName || "Trainer");
    socketRef.current = socket;

    socket.on("ROOM_STATE", (payload: any) => {
      if (payload.room) {
        setStudioState(payload.room.state || "LOBBY");
        setConnectedCount(payload.room.connectedTrainees || 0);
        setResponseCount(payload.room.totalResponses || 0);
        setOptionCounts(payload.room.optionCounts || {});
      }
    });

    socket.on("ATTENDEE_UPDATE", (payload: any) => {
      setConnectedCount(payload.connectedTrainees || 0);
    });

    socket.on("RESPONSE_STATS_UPDATE", (payload: any) => {
      if (payload.stats) {
        setResponseCount(payload.stats.totalResponses || 0);
        setOptionCounts(payload.stats.optionCounts || {});
      }
    });

    socket.on("QUESTION_LAUNCHED", (payload: any) => {
      setStudioState("ACTIVE");
      if (payload.question) {
        setBroadcastedId(payload.question.id);
      }
    });

    socket.on("SHOW_LEADERBOARD", () => {
      setStudioState("LEADERBOARD");
    });

    socket.on("RETURN_TO_LOBBY", () => {
      setStudioState("LOBBY");
      setBroadcastedId(null);
    });

    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conferenceUid, trainerName]);

  const handleBroadcastClick = (q: LiveStudioQuestion, index: number) => {
    setActiveQIndex(index);
    setBroadcastedId(q.id);
    setStudioState("ACTIVE");
    if (socketRef.current) {
      socketRef.current.startQuestion(
        {
          id: q.id,
          qNumber: q.qNumber,
          questionText: q.questionText,
          timerSecs: q.timerSecs,
          index,
        },
        q.timerSecs
      );
    }
    onBroadcast?.(q.id);
  };

  const handleLaunchNext = () => {
    const nextIdx = (activeQIndex + 1) % questions.length;
    const nextQ = questions[nextIdx];
    if (nextQ) {
      handleBroadcastClick(nextQ, nextIdx);
    }
    onLaunchNext?.();
  };

  const handleStopTimer = () => {
    if (socketRef.current) {
      socketRef.current.stopTimer();
    }
    onStopTimer?.();
  };

  const handleLeaderboard = () => {
    if (socketRef.current) {
      socketRef.current.showLeaderboard();
    }
    onLeaderboard?.();
  };

  const handleLobby = () => {
    if (socketRef.current) {
      socketRef.current.returnToLobby();
    }
    onLobby?.();
  };

  return (
    <View style={styles.card}>
      {/* Blue Top Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="radio" size={15} color={Colors.white} />
          <Text style={styles.headerTitle}>LIVE STUDIO</Text>
        </View>

        <View style={styles.headerBadgesRow}>
          <Pressable style={styles.headerPill} onPress={onTestSound}>
            <Ionicons name="volume-medium" size={9} color={Colors.white} />
            <Text style={styles.headerPillText}>Test Sound</Text>
          </Pressable>
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>ID: {systemId}</Text>
          </View>
          <View style={[styles.headerPill, isSystemLive && styles.headerGreenPill]}>
            <Ionicons name="wifi" size={9} color={Colors.white} />
            <Text style={styles.headerPillText}>
              {connectedCount > 0 ? `${connectedCount} Attendees` : isSystemLive ? "System Live" : "System Offline"}
            </Text>
          </View>
        </View>
      </View>

      {/* 3 Metric Summary Boxes */}
      <View style={styles.summaryBoxesRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>STATE</Text>
          <Text style={[styles.summaryBoxValue, { color: studioState === "ACTIVE" ? "#10B981" : "#2563EB" }]}>
            {studioState}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryBoxLabel}>ACTIVE Q-ID</Text>
          <Text style={styles.summaryBoxValue}>
            {studioState === "ACTIVE" ? `Q${activeQIndex + 1}` : "-"}
          </Text>
        </View>

        <View style={[styles.summaryBox, styles.summaryBoxHighlighted]}>
          <Text style={styles.summaryBoxLabel}>RESPONSES</Text>
          <Text style={[styles.summaryBoxValue, { color: "#10B981" }]}>
            {responseCount}
          </Text>
        </View>
      </View>

      {/* Questions List */}
      <View style={styles.questionsList}>
        {questions.map((q, idx) => {
          const isSent = broadcastedId === q.id;
          return (
            <View key={q.id} style={styles.questionRow}>
              <View style={styles.qBadgesCol}>
                <View style={styles.qNumPill}>
                  <Text style={styles.qNumText}>{q.qNumber}</Text>
                </View>
                <View style={styles.qTimerPill}>
                  <Ionicons name="alarm-outline" size={10} color={Colors.headerBlue} />
                  <Text style={styles.qTimerText}>{q.timerSecs}s Auto</Text>
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
                onPress={() => handleBroadcastClick(q, idx)}
              >
                <Ionicons
                  name={isSent ? "checkmark-circle" : "play"}
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
          onPress={handleLaunchNext}
        >
          <Ionicons name="play" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>LAUNCH NEXT</Text>
        </Pressable>

        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#EF4444" }]}
          onPress={handleStopTimer}
        >
          <Ionicons name="stop" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>STOP TIMER</Text>
        </Pressable>

        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#EAB308" }]}
          onPress={handleLeaderboard}
        >
          <Ionicons name="trophy" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>LEADERBOARD</Text>
        </Pressable>

        <Pressable
          style={[styles.bottomBtn, { backgroundColor: "#374151" }]}
          onPress={handleLobby}
        >
          <Ionicons name="pause" size={11} color={Colors.white} />
          <Text style={styles.bottomBtnText}>LOBBY</Text>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
  },
  headerPillText: {
    fontSize: 7.5,
    color: Colors.white,
    fontWeight: "700",
  },
  headerGreenPill: {
    backgroundColor: "#10B981",
  },
  summaryBoxesRow: {
    flexDirection: "row",
    gap: 6,
    padding: 10,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  summaryBoxHighlighted: {
    backgroundColor: "#FFFFFF",
    borderColor: "#10B981",
    borderWidth: 1.5,
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
    backgroundColor: Colors.gray50,
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
    gap: 3,
    backgroundColor: Colors.waitingBlueBg,
    borderWidth: 1,
    borderColor: Colors.notificationIconBg,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  qTimerText: {
    fontSize: 8,
    fontWeight: "700",
    color: Colors.headerBlue,
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bottomBtnText: {
    fontSize: 7.5,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.2,
  },
});
