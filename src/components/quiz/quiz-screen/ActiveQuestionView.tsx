import { ScrollView, StyleSheet, View } from "react-native";

import { AssessmentQuestion } from "@/api/assessment";
import QuizQuestionCard from "@/components/quiz/QuizQuestionCard";
import QuizTimer from "@/components/quiz/QuizTimer";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontSize } from "@/theme/typography";
import { toQuizQuestionData } from "./quizQuestionProps";

type ActiveQuestionViewProps = {
  seconds: number;
  question: AssessmentQuestion | undefined;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  submitError: string | null;
};

export default function ActiveQuestionView({
  seconds,
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  submitError,
}: ActiveQuestionViewProps) {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.activeTopSection}>
        <View style={styles.timerContainer}>
          <QuizTimer remainingSeconds={seconds} />
        </View>

        {question && (
          <QuizQuestionCard
            question={toQuizQuestionData(question, questionIndex, totalQuestions)}
            selectedOptionId={selectedOptionId}
            onSelectOption={onSelectOption}
            disabled={false}
            isResultMode={false}
          />
        )}

        {submitError && <AppText style={styles.inlineError}>{submitError}</AppText>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
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
  inlineError: {
    color: Colors.danger,
    fontSize: FontSize.caption,
    marginTop: 8,
    textAlign: "center",
  },
});
