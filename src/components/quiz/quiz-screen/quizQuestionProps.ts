import { AssessmentQuestion } from "@/api/assessment";
import { QuizQuestionData } from "@/components/quiz/QuizQuestionCard";

export function toQuizQuestionData(
  question: AssessmentQuestion,
  questionIndex: number,
  totalQuestions: number,
): QuizQuestionData {
  return {
    id: question.id,
    question: question.question,
    options: question.options,
    currentQuestion: questionIndex + 1,
    totalQuestions,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  };
}
