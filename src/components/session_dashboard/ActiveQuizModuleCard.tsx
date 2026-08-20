import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";

type ActiveQuizModuleCardProps = {
  moduleName?: string;
  targetedQps?: string;
  timer?: string;
  onEndQuiz?: () => void;
};

export default function ActiveQuizModuleCard({
  moduleName = "Quiz Module\n(Classroom Quiz Smartphone)",
  targetedQps = "Targeted 24 QPs",
  timer = "01:20:47",
  onEndQuiz,
}: ActiveQuizModuleCardProps) {
  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.liveBroadcastingBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE SESSION BROADCASTING</Text>
        </View>

        <View style={styles.timerPill}>
          <Text style={styles.timerText}>{timer}</Text>
        </View>
      </View>

      {/* Module Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.activeModuleLabel}>ACTIVE MODULE</Text>
        <Text style={styles.moduleTitle}>{moduleName}</Text>
        <View style={styles.targetedPill}>
          <Text style={styles.targetedText}>{targetedQps}</Text>
        </View>
      </View>

      {/* Big White End Quiz Button */}
      <Pressable
        style={styles.endQuizBtn}
        onPress={onEndQuiz}
        accessibilityRole="button"
        accessibilityLabel="End Quiz"
      >
        <Ionicons name="power" size={16} color="#0066FF" />
        <Text style={styles.endQuizBtnText}>END QUIZ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0066FF",
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 14,
    marginTop: 10,
    ...Shadows.raised,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  liveBroadcastingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  liveText: {
    fontSize: 8.5,
    fontWeight: "700",
    color: Colors.white,
    letterSpacing: 0.3,
  },
  timerPill: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 0.5,
  },
  titleSection: {
    marginTop: 12,
    gap: 4,
  },
  activeModuleLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.75)",
    letterSpacing: 0.5,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.white,
    lineHeight: 20,
  },
  targetedPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  targetedText: {
    fontSize: 9.5,
    fontWeight: "600",
    color: Colors.white,
  },
  endQuizBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 14,
    ...Shadows.card,
  },
  endQuizBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0066FF",
    letterSpacing: 0.5,
  },
});
