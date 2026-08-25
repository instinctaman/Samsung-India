import {
  AssessmentMap,
  QuizLeaderboard,
  QuizResult,
  QuizWaiting,
} from "@/components/quiz";
import { useQuiz } from "@/hooks/useQuiz";
import ActiveQuestionView from "./ActiveQuestionView";
import { toQuizQuestionData } from "./quizQuestionProps";

type QuizPhaseContentProps = {
  quiz: ReturnType<typeof useQuiz>;
};

export default function QuizPhaseContent({ quiz }: QuizPhaseContentProps) {
  const {
    phase,
    result,
    handleContinueAfterResults,
    handleViewAllRankings,
    questions,
    answers,
    questionIndex,
    openQuestionFromMap,
    setPhase,
    finishQuiz,
    submitting,
    handleSyncNow,
    question,
    resultType,
    selectedOptionId,
    seconds,
    handleSelectOption,
    submitError,
  } = quiz;

  if (phase === "leaderboard" && result) {
    return (
      <QuizLeaderboard result={result} onContinue={handleContinueAfterResults} onViewAllRankings={handleViewAllRankings} />
    );
  }

  if (phase === "map") {
    return (
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
    );
  }

  if (phase === "result" && question) {
    const questionData = toQuizQuestionData(question, questionIndex, questions.length);
    return (
      <QuizResult
        type={resultType}
        question={questionData}
        selectedOptionId={selectedOptionId}
        correctOptionId={question.correctAnswer}
        explanation={question.explanation}
      />
    );
  }

  if (phase === "waiting") {
    const nextQuestionNumber = questionIndex + 2;
    return (
      <QuizWaiting
        onSyncNow={handleSyncNow}
        nextQuestionNumber={nextQuestionNumber}
        message={`Look at the main screen.\nQuestion ${
          nextQuestionNumber <= questions.length ? nextQuestionNumber : ""
        } will begin shortly!`}
      />
    );
  }

  return (
    <ActiveQuestionView
      seconds={seconds}
      question={question}
      questionIndex={questionIndex}
      totalQuestions={questions.length}
      selectedOptionId={selectedOptionId}
      onSelectOption={handleSelectOption}
      submitError={submitError}
    />
  );
}
