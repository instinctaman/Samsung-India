import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

type ScoreCardProps = {
  accuracy: number;
  correctCount: number;
  totalQuestions: number;
  timeTakenFormatted: string;
};

export default function ScoreCard({ accuracy, correctCount, totalQuestions, timeTakenFormatted }: ScoreCardProps) {
  return (
    <View style={styles.scoreCard}>
      <AppText style={styles.scoreLabel} color={Colors.white} weight={FontWeight.semiBold}>
        YOUR LIVE ACCURACY
      </AppText>

      <AppText style={styles.scoreValue} color={Colors.white} weight={FontWeight.bold}>
        {accuracy}%
      </AppText>

      <View style={styles.pillsRow}>
        <View style={styles.pillItem}>
          <Ionicons name="disc-outline" size={14} color={Colors.white} />
          <AppText style={styles.pillText} color={Colors.white} weight={FontWeight.semiBold}>
            {correctCount} / {totalQuestions} Correct
          </AppText>
        </View>

        <View style={styles.pillItem}>
          <Ionicons name="time-outline" size={14} color={Colors.white} />
          <AppText style={styles.pillText} color={Colors.white} weight={FontWeight.semiBold}>
            {timeTakenFormatted} Taken
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: Colors.headerBlue,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 10,
  },
  scoreLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  scoreValue: {
    fontSize: 42,
    lineHeight: 48,
    marginVertical: 4,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  pillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11.5,
  },
});
