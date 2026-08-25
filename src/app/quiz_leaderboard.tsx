import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AccuracyScoreCard, GlobalLeaderboardCard, ResultsHero } from "@/components/quiz/leaderboard";
import PerformanceSummary from "@/components/quiz/PerformanceSummary";
import QuizLiveHeader from "@/components/quiz/QuizLiveHeader";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { useQuizLeaderboard } from "@/hooks/useQuizLeaderboard";

export default function QuizLeaderboardScreen() {
  const {
    insets,
    screenWidth,
    total,
    correct,
    accuracy,
    incorrect,
    timeTakenFormatted,
    filterOpen,
    setFilterOpen,
    filterValues,
    setFilterValues,
    leaderboardUsers,
    handleApplyFilter,
    handleContinue,
  } = useQuizLeaderboard();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />

      <QuizLiveHeader onSync={() => {}} onRefresh={() => {}} isConnected={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ResultsHero screenWidth={screenWidth} />

        <AccuracyScoreCard
          accuracy={accuracy}
          correct={correct}
          total={total}
          timeTakenFormatted={timeTakenFormatted}
        />

        <PerformanceSummary correctCount={correct} incorrectCount={incorrect} accuracy={accuracy} timeTaken="28m" />

        <GlobalLeaderboardCard
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          onApplyFilter={handleApplyFilter}
          leaderboardUsers={leaderboardUsers}
        />

        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to Dashboard"
        >
          <AppText style={styles.continueButtonText} color={Colors.white} weight={FontWeight.bold}>
            Continue
          </AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.headerBlue,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 12,
  },
  continueButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.headerBlue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  continueButtonText: {
    fontSize: 16,
  },
});
