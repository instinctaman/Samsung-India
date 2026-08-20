import React from "react";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import WinImage from "@/assets/images/svg/win.svg";
import AppText from "@/components/ui/AppText";
import PerformanceSummary from "./PerformanceSummary";
import LeaderboardList from "./LeaderboardList";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { AssessmentResult } from "@/api/assessment";

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
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Trophy Illustration Hero */}
      <View style={styles.trophyWrapper}>
        <View style={styles.trophyBanner}>
          <WinImage width={screenWidth} height={133} />
        </View>
        <AppText style={styles.resultsTitle} weight={FontWeight.bold}>
          Results
        </AppText>
        <AppText style={styles.resultsSubtitle}>
          Great attempt! Keep going and improve your score.
        </AppText>
      </View>


      {/* 2. Royal Blue Score Card */}
      <View style={styles.scoreCard}>
        <AppText
          style={styles.scoreLabel}
          color={Colors.white}
          weight={FontWeight.semiBold}
        >
          YOUR LIVE ACCURACY
        </AppText>

        <AppText
          style={styles.scoreValue}
          color={Colors.white}
          weight={FontWeight.bold}
        >
          {accuracy}%
        </AppText>

        {/* Dual Pills Row */}
        <View style={styles.pillsRow}>
          <View style={styles.pillItem}>
            <Ionicons name="disc-outline" size={14} color={Colors.white} />
            <AppText
              style={styles.pillText}
              color={Colors.white}
              weight={FontWeight.semiBold}
            >
              {correctCount} / {totalQuestions} Correct
            </AppText>
          </View>

          <View style={styles.pillItem}>
            <Ionicons name="time-outline" size={14} color={Colors.white} />
            <AppText
              style={styles.pillText}
              color={Colors.white}
              weight={FontWeight.semiBold}
            >
              {timeTakenFormatted} Taken
            </AppText>
          </View>
        </View>
      </View>

      {/* 3. Performance Summary Card */}
      <PerformanceSummary
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        accuracy={accuracy}
        timeTaken="23m"
      />

      {/* 4. Global Top 5 Leaderboard Card */}
      <LeaderboardList
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        accuracy={accuracy}
        onViewAll={onViewAllRankings}
      />

      {/* 5. Continue Button */}
      <Pressable
        style={styles.continueButton}
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to Dashboard"
      >
        <AppText
          style={styles.continueButtonText}
          color={Colors.white}
          weight={FontWeight.bold}
        >
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
  trophyWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  trophyBanner: {
    width: "100%",
    height: 133,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -16,
  },
  resultsTitle: {

    fontSize: 26,
    color: "#111827",
    marginTop: 6,
  },
  resultsSubtitle: {
    fontSize: 12.5,
    color: Colors.gray600,
    textAlign: "center",
    marginTop: 3,
  },
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
