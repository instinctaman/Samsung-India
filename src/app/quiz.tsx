import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuizLiveHeader } from "@/components/quiz";
import { QuizLoadErrorView, QuizLoadingView, QuizNavBar, QuizPhaseContent } from "@/components/quiz/quiz-screen";
import { useQuiz } from "@/hooks/useQuiz";
import { Colors } from "@/theme/colors";

export default function QuizScreen() {
  const quiz = useQuiz();
  const { questions, question, questionIndex, phase, loading, loadError, loadQuestions, handleSyncNow, goToPrevPhase, goToNextPhase } = quiz;

  if (loading) {
    return <QuizLoadingView />;
  }

  if (loadError && questions.length === 0) {
    return <QuizLoadErrorView error={loadError} onRetry={loadQuestions} />;
  }

  if (!question && phase !== "leaderboard" && phase !== "map") return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      {phase !== "map" && (
        <QuizLiveHeader
          onSync={phase === "waiting" ? undefined : handleSyncNow}
          onRefresh={handleSyncNow}
          isConnected={true}
          showConnectionLabel={phase === "waiting"}
        />
      )}

      <View style={styles.body}>
        <View style={styles.phaseContent}>
          <QuizPhaseContent quiz={quiz} />
        </View>

        {(phase === "active" || phase === "result") && (
          <QuizNavBar
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            onPrevious={goToPrevPhase}
            onNext={goToNextPhase}
          />
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
  phaseContent: {
    flex: 1,
    minHeight: 0,
  },
});
