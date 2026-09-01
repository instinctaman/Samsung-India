import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, LiveQuizView, getLiveQuizView, submitLiveAnswer } from "@/api/session";
import { useAuth } from "@/hooks/useAuth";
import { useCountdown } from "@/hooks/useCountdown";
import { useLiveQuizChannel } from "@/hooks/useLiveQuizChannel";

// Fallback poll - the /ws/live nudge is the primary trigger, this just covers
// a dropped socket.
const POLL_MS = 5000;

export function useLiveQuiz() {
  const router = useRouter();
  const { token } = useAuth();
  const { conferenceUid } = useLocalSearchParams<{ conferenceUid: string }>();

  const [view, setView] = useState<LiveQuizView | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerRejected, setAnswerRejected] = useState(false);
  const activeQuestionIdRef = useRef<number | null>(null);

  const refetch = useCallback(async () => {
    if (!token || !conferenceUid) return;
    try {
      const next = await getLiveQuizView(token, conferenceUid);
      setLoadError(null);
      setView(next);

      const qid = next.question?.id ?? null;
      if (qid !== activeQuestionIdRef.current) {
        activeQuestionIdRef.current = qid;
        setSelectedOption(null);
        setAnswerRejected(false);
      }
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Couldn't load the quiz.");
    }
  }, [token, conferenceUid]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      const id = setInterval(refetch, POLL_MS);
      return () => clearInterval(id);
    }, [refetch]),
  );

  useLiveQuizChannel(conferenceUid, token, refetch);

  const isQuestionLive = view?.state === "QUESTION_LIVE";
  const secondsLeft = useCountdown(isQuestionLive ? view?.timerEndsAt : null);

  // Answer is locked once: the trainee picked and it was accepted, the timer
  // ran out, or the server rejected the pick as stale. Derived, no effect.
  const timedOut = isQuestionLive && !!view?.timerEndsAt && secondsLeft <= 0;
  const locked = !!view?.alreadyAnswered || answerRejected || timedOut;

  // Session ended - drop back to the session timeline.
  useEffect(() => {
    if (view?.state !== "FINISHED") return;
    const t = setTimeout(() => router.replace("/session_detail"), 2500);
    return () => clearTimeout(t);
  }, [view?.state, router]);

  const questionId = view?.question?.id ?? null;
  const selectOption = useCallback(
    async (optionId: string) => {
      if (locked || !token || !conferenceUid || questionId == null) return;
      setSelectedOption(optionId);
      try {
        const res = await submitLiveAnswer(token, conferenceUid, questionId, optionId);
        if (!res.accepted) setAnswerRejected(true);
      } catch {
        // keep the local selection; a later refetch reconciles
      }
    },
    [locked, token, conferenceUid, questionId],
  );

  return { view, loadError, selectedOption, locked, secondsLeft, selectOption, refetch, router };
}
