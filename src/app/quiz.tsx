import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AssessmentMap,
  QuizLeaderboard,
  QuizLiveHeader,
  QuizQuestionCard,
  QuizResult,
  QuizTimer,
  QuizWaiting,
} from "@/components/quiz";
import AppText from "@/components/ui/AppText";
import { useQuiz } from "@/hooks/useQuiz";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";

export default function QuizScreen() {
  const {
    questions,
    question,
    questionIndex,
    phase,
    seconds,
    selectedOptionId,
    resultType,
    answers,
    loading,
    loadError,
    submitting,
    submitError,
    result,
    loadQuestions,
    handleSelectOption,
    handleSyncNow,
    openQuestionFromMap,
    finishQuiz,
    skipQuiz,
    setPhase,
    handleContinueAfterResults,
    handleViewAllRankings,
  } = useQuiz();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.headerBlue} size="large" />
        <AppText variant="body" color={Colors.gray600} align="center">
          Loading the quiz…
        </AppText>
      </SafeAreaView>
    );
  }

  if (loadError && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <AppText variant="body" color={Colors.danger} align="center">
          {loadError}
        </AppText>
        <Pressable style={styles.retryButton} onPress={loadQuestions}>
          <AppText
            variant="label"
            color={Colors.white}
            weight={FontWeight.bold}
          >
            Try Again
          </AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!question && phase !== "leaderboard" && phase !== "map") return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {/* Top Header - Rendered on active, result, waiting, and leaderboard */}
      {phase !== "map" && (
        <QuizLiveHeader
          onSync={handleSyncNow}
          onRefresh={handleSyncNow}
          isConnected={true}
        />
      )}

      {/* Main Full-Height Body Area */}
      <View style={styles.body}>
        {/* 1. Quiz Leaderboard / Results Screen */}
        {phase === "leaderboard" && result ? (
          <QuizLeaderboard
            result={result}
            onContinue={handleContinueAfterResults}
            onViewAllRankings={handleViewAllRankings}
          />
        ) : /* 2. Assessment Map Screen */
        phase === "map" ? (
          <AssessmentMap
            totalQuestions={questions.length}
            answers={answers}
            currentIndex={questionIndex}
            onSelectQuestion={openQuestionFromMap}
            onReviewQuestions={() => setPhase("active")}
            onSubmit={finishQuiz}
            submitting={submitting}
            onSync={handleSyncNow}
          />
        ) : /* 3. Result State (Correct / Incorrect / Time's Up) */
        phase === "result" && question ? (
          <QuizResult
            type={resultType}
            question={{
              id: question.id,
              question: question.question,
              options: question.options,
              currentQuestion: questionIndex + 1,
              totalQuestions: questions.length,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
            }}
            selectedOptionId={selectedOptionId}
            correctOptionId={question.correctAnswer}
            explanation={question.explanation}
          />
        ) : /* 4. Waiting for Trainer Screen (Between questions) */
        phase === "waiting" ? (
          <QuizWaiting
            onSyncNow={handleSyncNow}
            nextQuestionNumber={questionIndex + 2}
            message={`Look at the main screen.\nQuestion ${
              questionIndex + 2 <= questions.length ? questionIndex + 2 : ""
            } will begin shortly!`}
          />
        ) : (
          /* 5. Active Answering Question Screen (Full Height) */
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.activeTopSection}>
              {/* Circular Countdown Timer Block */}
              <View style={styles.timerContainer}>
                <QuizTimer remainingSeconds={seconds} />
              </View>

              {/* Dynamic Question Card with Colored Options */}

              {question && (
                <QuizQuestionCard
                  question={{
                    id: question.id,
                    question: question.question,
                    options: question.options,
                    currentQuestion: questionIndex + 1,
                    totalQuestions: questions.length,
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation,
                  }}
                  selectedOptionId={selectedOptionId}
                  onSelectOption={handleSelectOption}
                />
              )}

              {/* === [TEMPORARY DEV SKIP BUTTON - REMOVE LATER] === */}
              <Pressable
                style={styles.devSkipButton}
                onPress={skipQuiz}
                accessibilityRole="button"
                accessibilityLabel="Skip Test (Testing Mode)"
              >
                <Ionicons name="play-forward" size={13} color="#D97706" />
                <AppText
                  variant="caption"
                  color="#92400E"
                  weight={FontWeight.bold}
                >
                  Skip Test (Testing)
                </AppText>
              </Pressable>
              {/* === [END TEMPORARY DEV SKIP BUTTON] === */}

              {submitError && (
                <AppText
                  variant="caption"
                  color={Colors.danger}
                  align="center"
                  style={styles.inlineError}
                >
                  {submitError}
                </AppText>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    minHeight: 0,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  retryButton: {
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  inlineError: {
    marginTop: 8,
  },
  content: {
    flexGrow: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  activeTopSection: {
    width: "100%",
    alignItems: "center",
  },
  timerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    paddingBottom: 8,
  },
  devSkipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCD34D",
    alignSelf: "center",
  },
});
