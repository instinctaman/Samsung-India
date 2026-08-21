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

  // Automatic evaluation when 30 seconds reach 0
  const handleTimerExpired = useCallback(() => {
    if (isProcessingExpiryRef.current) return;
    isProcessingExpiryRef.current = true;
    clearAutoTimeouts();

    const currentSelected = selectedOptionIdRef.current;
    const currentQ = questions[questionIndex];

    if (!currentQ) return;

    if (currentSelected) {
      const correctId = currentQ.correctAnswer ?? "A";
      const isCorrect = currentSelected === correctId;
      setResultType(isCorrect ? "correct" : "incorrect");
      setAnswers((prev) => ({
        ...prev,
        [questionIndex]: currentSelected,
      }));
    } else {
      setResultType("timeout");
      setAnswers((prev) => ({
        ...prev,
        [questionIndex]: null,
      }));
    }

    setPhase("result");
  }, [clearAutoTimeouts, questionIndex, questions]);

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
        // After final question (Question 4) completed -> Show Assessment Map
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

  // === [TEMPORARY DEV SKIP - REMOVE LATER] ===
  const skipQuiz = async () => {
    clearAutoTimeouts();
    if (!token || !suiteUid || !conferenceUid) {
      setResult({
        totalScore: 3,
        maxScore: questions.length || 4,
        percentage: 75,
        correctCount: 3,
        totalQuestions: questions.length || 4,
      });
      setHasSubmitted(true);
      setPhase("leaderboard");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitAssessment(
        token,
        suiteUid,
        conferenceUid,
        questions.map((q) => ({
          questionId: q.id,
          selectedOption: q.correctAnswer ?? "A",
        })),
      );
      setResult(data);
      setHasSubmitted(true);
      setPhase("leaderboard");
    } catch {
      setResult({
        totalScore: 3,
        maxScore: questions.length || 4,
        percentage: 75,
        correctCount: 3,
        totalQuestions: questions.length || 4,
      });
      setHasSubmitted(true);
      setPhase("leaderboard");
    } finally {
      setSubmitting(false);
    }
  };
  // === [END TEMPORARY DEV SKIP] ===

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
    finishQuiz,
    skipQuiz,
    setPhase,
    handleContinueAfterResults,
    handleViewAllRankings,
    router,
  };
}
