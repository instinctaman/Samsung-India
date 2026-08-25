import { Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";

import { AssessmentResult } from "@/api/assessment";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import LeaderboardList from "./LeaderboardList";
import PerformanceSummary from "./PerformanceSummary";
import { ScoreCard, TrophyHero } from "./quiz-leaderboard";

export type QuizLeaderboardProps = {
  result: AssessmentResult;
  timeTakenFormatted?: string;
  onContinue: () => void;
  onViewAllRankings?: () => void;
};

export default function QuizLeaderboard({
  result,
  timeTakenFormatted = "23m 15s",
  onContinue,
  onViewAllRankings,
}: QuizLeaderboardProps) {
  const { width: screenWidth } = useWindowDimensions();
  const accuracy = Math.round(result.percentage);
  const correctCount = result.correctCount;
  const totalQuestions = result.totalQuestions;
  const incorrectCount = Math.max(0, totalQuestions - correctCount);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <TrophyHero screenWidth={screenWidth} />

      <ScoreCard accuracy={accuracy} correctCount={correctCount} totalQuestions={totalQuestions} timeTakenFormatted={timeTakenFormatted} />

      <PerformanceSummary correctCount={correctCount} incorrectCount={incorrectCount} accuracy={accuracy} timeTaken="23m" />

      <LeaderboardList correctCount={correctCount} totalQuestions={totalQuestions} accuracy={accuracy} onViewAll={onViewAllRankings} />

      <Pressable style={styles.continueButton} onPress={onContinue} accessibilityRole="button" accessibilityLabel="Continue to Dashboard">
        <AppText style={styles.continueButtonText} color={Colors.white} weight={FontWeight.bold}>
          Continue
        </AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.headerBlue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  continueButtonText: {
    fontSize: 16,
  },
});
