import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ApiError,
  AssessmentQuestion,
  AssessmentResult,
  getAssessmentQuestions,
  submitAssessment,
} from "@/api/assessment";
import { useAuth } from "@/hooks/useAuth";

export const QUESTION_SECONDS = 30;
export const RESULT_DISPLAY_SECONDS = 3500;
export const WAITING_INTERMEDIATE_SECONDS = 5000;

export type QuizPhase = "waiting" | "active" | "result" | "map" | "leaderboard";
export type QuizResultType = "correct" | "incorrect" | "timeout";

export function useQuiz() {
  const router = useRouter();
  const { token } = useAuth();
  const { conferenceUid, suiteUid } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
  }>();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<QuizPhase>("active");
  const [seconds, setSeconds] = useState(QUESTION_SECONDS);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resultType, setResultType] = useState<QuizResultType>("correct");
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  const [submitting, setSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const question = questions[questionIndex];
  const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedOptionIdRef = useRef<string | null>(null);
  const isProcessingExpiryRef = useRef<boolean>(false);

  // Keep ref updated to prevent stale closures during countdown
  useEffect(() => {
    selectedOptionIdRef.current = selectedOptionId;
  }, [selectedOptionId]);

  const clearAutoTimeouts = useCallback(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
  }, []);

  // Shared: record the answer + resultType for qIndex and move to result phase.
  // Called by both the automatic timer expiry and manual Next navigation.
  const finalizeQuestion = useCallback(
    (qIndex: number, selectedId: string | null) => {
      const currentQ = questions[qIndex];
      if (!currentQ) return;
      if (selectedId) {
        const correctId = currentQ.correctAnswer ?? "A";
        setResultType(selectedId === correctId ? "correct" : "incorrect");
      } else {
        setResultType("timeout");
      }
      setAnswers((prev) => ({ ...prev, [qIndex]: selectedId }));
      setPhase("result");
    },
    [questions],
  );

  // Automatic evaluation when 30 seconds reach 0
  const handleTimerExpired = useCallback(() => {
    if (isProcessingExpiryRef.current) return;
    isProcessingExpiryRef.current = true;
    clearAutoTimeouts();
    finalizeQuestion(questionIndex, selectedOptionIdRef.current);
  }, [clearAutoTimeouts, finalizeQuestion, questionIndex]);

  const loadQuestions = useCallback(async () => {
    if (!token || !suiteUid) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getAssessmentQuestions(token, suiteUid);
      setQuestions(data.questions);
    } catch (err) {
      setLoadError(
        err instanceof ApiError ? err.message : "Couldn't load the quiz.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, suiteUid]);

  // Advance to Next Question
  const advanceToNextQuestion = useCallback(() => {
    clearAutoTimeouts();
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      selectedOptionIdRef.current = null;
      setSeconds(QUESTION_SECONDS);
      setPhase("active");
    } else {
      setPhase("map");
    }
  }, [clearAutoTimeouts, questionIndex, questions.length]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!token || !suiteUid) return;
      try {
        const data = await getAssessmentQuestions(token, suiteUid);
        if (!ignore) {
          setQuestions(data.questions);
        }
      } catch (err) {
        if (!ignore) {
          setLoadError(
            err instanceof ApiError ? err.message : "Couldn't load the quiz.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [token, suiteUid]);

  // 1. Active Question 30-second Countdown Timer
  useEffect(() => {
    if (phase !== "active" || !question) return;

    isProcessingExpiryRef.current = false;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimerExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, questionIndex, question, handleTimerExpired]);

  // Trainee selects or changes an option during 30s (DOES NOT submit immediately)
  const handleSelectOption = (optionId: string) => {
    if (phase !== "active" || !question) return;
    setSelectedOptionId(optionId);
    selectedOptionIdRef.current = optionId;
  };

  // 2. Automated Transition: Result -> Waiting (for Q1, Q2, Q3) OR Result -> Assessment Map (after Q4)
  useEffect(() => {
    if (phase !== "result") return;

    clearAutoTimeouts();
    autoNextTimeoutRef.current = setTimeout(() => {
      if (questionIndex + 1 < questions.length) {
        setPhase("waiting");
      } else {
        // After final question completed -> Show Assessment Map
        setPhase("map");
      }
    }, RESULT_DISPLAY_SECONDS);

    return clearAutoTimeouts;
  }, [phase, questionIndex, questions.length, clearAutoTimeouts]);

  // 3. Automated Transition: Waiting (5 seconds) -> Next Question Active
  useEffect(() => {
    if (phase !== "waiting") return;

    clearAutoTimeouts();
    autoNextTimeoutRef.current = setTimeout(() => {
      advanceToNextQuestion();
    }, WAITING_INTERMEDIATE_SECONDS);

    return clearAutoTimeouts;
  }, [phase, advanceToNextQuestion, clearAutoTimeouts]);

  // Direct manual Sync / Skip waiting
  const handleSyncNow = () => {
    if (phase === "result") {
      if (questionIndex + 1 < questions.length) {
        setPhase("waiting");
      } else {
        setPhase("map");
      }
    } else if (phase === "waiting") {
      advanceToNextQuestion();
    } else {
      loadQuestions();
    }
  };

  // Open question from assessment map for review
  const openQuestionFromMap = (index: number) => {
    clearAutoTimeouts();
    const prevAnswer = answers[index];
    setQuestionIndex(index);
    setSelectedOptionId(prevAnswer ?? null);
    selectedOptionIdRef.current = prevAnswer ?? null;
    setSeconds(QUESTION_SECONDS);
    setPhase("active");
  };

  // Final submit handler with duplicate protection and API call
  const finishQuiz = async () => {
    clearAutoTimeouts();
    if (!token || !suiteUid || !conferenceUid || submitting || hasSubmitted)
      return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitAssessment(
        token,
        suiteUid,
        conferenceUid,
        questions.map((q, idx) => ({
          questionId: q.id,
          selectedOption: answers[idx] ?? null,
        })),
      );
      setResult(data);
      setHasSubmitted(true);
      setPhase("leaderboard");
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : "Couldn't submit the quiz.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueAfterResults = () => {
    router.replace({
      pathname: "/session_detail",
      params: {
        attendance: "recorded",
        quiz: "completed",
        score: result
          ? `${result.correctCount}/${result.totalQuestions}`
          : "3/4",
        duration: "Ran : 1h 55m",
      },
    });
  };

  const handleViewAllRankings = () => {
    if (!result) return;
    const accuracy = Math.round(result.percentage);
    router.push({
      pathname: "/quiz_leaderboard",
      params: {
        correct: String(result.correctCount),
        total: String(result.totalQuestions),
        accuracy: String(accuracy),
      },
    });
  };

  // Manual Next: active → result (shared finalizeQuestion), result → waiting/map
  const goToNextPhase = useCallback(() => {
    if (phase === "active") {
      // Guard against racing with the countdown timer
      if (isProcessingExpiryRef.current) return;
      isProcessingExpiryRef.current = true;
      clearAutoTimeouts();
      finalizeQuestion(questionIndex, selectedOptionIdRef.current);
    } else if (phase === "result") {
      clearAutoTimeouts();
      if (questionIndex + 1 < questions.length) {
        setPhase("waiting");
      } else {
        setPhase("map");
      }
    }
  }, [phase, clearAutoTimeouts, finalizeQuestion, questionIndex, questions.length]);

  // Manual Previous: always navigates to the previous question's result phase.
  // Never reopens the active phase for an already-answered question.
  const goToPrevPhase = useCallback(() => {
    if (questionIndex === 0) return;
    if (phase !== "active" && phase !== "result") return;

    // Stop any running timer (active countdown or result auto-timeout)
    if (phase === "active") {
      if (isProcessingExpiryRef.current) return;
      isProcessingExpiryRef.current = true;
    }
    clearAutoTimeouts();

    const prevIndex = questionIndex - 1;
    const prevAnswer = answers[prevIndex] ?? null;
    const prevQ = questions[prevIndex];

    setQuestionIndex(prevIndex);
    setSelectedOptionId(prevAnswer);
    selectedOptionIdRef.current = prevAnswer;

    if (prevAnswer) {
      const correctId = prevQ?.correctAnswer ?? "A";
      setResultType(prevAnswer === correctId ? "correct" : "incorrect");
    } else {
      setResultType("timeout");
    }
    setPhase("result");
  }, [phase, questionIndex, answers, questions, clearAutoTimeouts]);

  return {
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
    hasSubmitted,
    submitError,
    result,
    loadQuestions,
    handleSelectOption,
    handleSyncNow,
    openQuestionFromMap,
    advanceToNextQuestion,
    goToNextPhase,
    goToPrevPhase,
    finishQuiz,
    setPhase,
    handleContinueAfterResults,
    handleViewAllRankings,
    router,
  };
}
