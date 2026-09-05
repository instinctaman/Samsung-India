import { Pressable, StyleSheet, View } from "react-native";
import AppText from "@/components/ui/AppText";
import { Ionicons } from "@expo/vector-icons";

import { LiveStudio } from "@/api/training";
import { Colors } from "@/theme/colors";
import { LiveQuizControls } from "./sessionDashboardTypes";

type Props = {
  state: LiveStudio["state"];
  questions: LiveStudio["questions"];
  activeQuestionId: number | null;
  controls: LiveQuizControls;
};

export default function LiveStudioActions({ state, questions, activeQuestionId, controls }: Props) {
  const activeIdx = questions.findIndex((q) => q.id === activeQuestionId);
  const next = questions[activeIdx + 1] ?? (activeIdx === -1 ? questions[0] : undefined);
  const isLive = state === "QUESTION_LIVE";

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Btn
          label="LAUNCH NEXT"
          icon="play"
          color="#0066FF"
          disabled={!next}
          onPress={() => next && controls.onBroadcast(next.id)}
        />
        <Btn label="STOP TIMER" icon="stop" color="#EF4444" disabled={!isLive} onPress={controls.onStopTimer} />
        <Btn label="LEADERBOARD" icon="trophy" color="#EAB308" onPress={controls.onLeaderboard} />
        <Btn label="LOBBY" icon="pause" color="#374151" onPress={controls.onLobby} />
      </View>
      <Pressable style={styles.finishBtn} onPress={controls.onFinish}>
        <Ionicons name="flag" size={11} color="#EF4444" />
        <AppText style={styles.finishText}>FINISH LIVE QUIZ</AppText>
      </Pressable>
    </View>
  );
}

function Btn({
  label,
  icon,
  color,
  disabled,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.btn, { backgroundColor: color }, disabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={11} color={Colors.white} />
      <AppText style={styles.btnText}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingBottom: 10, gap: 6 },
  row: { flexDirection: "row", gap: 4 },
  btn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 7.5, fontWeight: "800", color: Colors.white, letterSpacing: 0.2 },
  finishBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  finishText: { fontSize: 8.5, fontWeight: "800", color: "#EF4444", letterSpacing: 0.3 },
});
