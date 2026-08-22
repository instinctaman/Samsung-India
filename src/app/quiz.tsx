import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
import { FontSize, FontWeight } from "@/theme/typography";

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
    goToNextPhase,
    goToPrevPhase,
    finishQuiz,
    setPhase,
    handleContinueAfterResults,
    handleViewAllRankings,
  } = useQuiz();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.headerBlue} size="large" />
        <AppText style={styles.loadingText}>Loading the quiz…</AppText>
      </SafeAreaView>
    );
  }

  if (loadError && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <AppText style={styles.loadingText}>{loadError}</AppText>
        <Pressable style={styles.retryButton} onPress={loadQuestions}>
          <AppText color={Colors.white} weight={FontWeight.bold}>
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
        {/* Phase Content — takes all available space above the nav bar */}
        <View style={styles.phaseContent}>
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
                    disabled={false}
                    isResultMode={false}
                  />
                )}

                {submitError && (
                  <AppText style={styles.inlineError}>{submitError}</AppText>
                )}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Previous / Next Navigation Bar — shown on active and result phases only */}
        {(phase === "active" || phase === "result") && (
          <View style={styles.navBar}>
            {/* Previous — outlined, disabled on Q1 */}
            <Pressable
              style={[
                styles.prevBtn,
                questionIndex === 0 && styles.prevBtnDisabled,
              ]}
              onPress={goToPrevPhase}
              disabled={questionIndex === 0}
              accessibilityRole="button"
              accessibilityLabel="Previous question"
            >
              <Ionicons
                name="arrow-back"
                size={15}
                color={questionIndex === 0 ? Colors.gray400 : Colors.headerBlue}
              />
              <AppText
                style={[
                  styles.prevBtnText,
                  questionIndex === 0 && styles.prevBtnTextDisabled,
                ]}
                weight={FontWeight.bold}
              >
                Previous
              </AppText>
            </Pressable>

            {/* Dot-step progress indicator */}
            <View style={styles.dotRow}>
              {questions.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === questionIndex && styles.dotActive]}
                />
              ))}
            </View>

            {/* Next — solid primary */}
            <Pressable
              style={styles.nextBtn}
              onPress={goToNextPhase}
              accessibilityRole="button"
              accessibilityLabel="Next question"
            >
              <AppText style={styles.nextBtnText} weight={FontWeight.bold}>
                Next
              </AppText>
              <Ionicons name="arrow-forward" size={15} color={Colors.white} />
            </Pressable>
          </View>
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
  loadingText: {
    fontSize: FontSize.label,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  inlineError: {
    color: Colors.danger,
    fontSize: FontSize.caption,
    marginTop: 8,
    textAlign: "center",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  activeTopSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  /* Phase content wrapper — takes all flex space so navBar stays at bottom */
  phaseContent: {
    flex: 1,
    minHeight: 0,
  },

  /* ── Navigation Bar ── */
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },

  /* Previous — outlined secondary */
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.headerBlue,
    backgroundColor: Colors.white,
  },
  prevBtnDisabled: {
    borderColor: Colors.gray200,
    backgroundColor: Colors.gray100,
  },
  prevBtnText: {
    fontSize: 13,
    color: Colors.headerBlue,
  },
  prevBtnTextDisabled: {
    color: Colors.gray400,
  },

  /* Dot-step progress indicator */
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.gray200,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.headerBlue,
  },

  /* Next — solid primary */
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: Colors.headerBlue,
  },
  nextBtnText: {
    fontSize: 13,
    color: Colors.white,
  },
});
