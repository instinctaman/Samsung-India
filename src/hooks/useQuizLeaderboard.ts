/**
 * useQuizLeaderboard Hook
 * Encapsulates quiz score stats, filter controls, leaderboard user generation,
 * and navigation actions.
 */

import { LeaderboardFilterValues } from "@/components/quiz/LeaderboardFilter";
import { LeaderboardUser } from "@/components/quiz/LeaderboardRow";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SAMPLE_LEADERBOARD_NAMES = [
  "Priyanshu Bora",
  "Ankit Kumar",
  "Anand Singh",
  "Ameerul Haque",
];

function generateLeaderboardUsers(
  totalQuestions: number,
  correctCount: number,
  accuracy: number,
  _zoneFilter?: string,
): LeaderboardUser[] {
  const list: LeaderboardUser[] = [
    {
      name: "You",
      score: `${correctCount}/${totalQuestions}`,
      accuracy: `${accuracy}%`,
      isYou: true,
    },
  ];

  for (let i = 0; i < 100; i++) {
    const name = SAMPLE_LEADERBOARD_NAMES[i % SAMPLE_LEADERBOARD_NAMES.length];
    const scoreVal =
      i < 6
        ? totalQuestions
        : i < 14
          ? Math.max(1, totalQuestions - 1)
          : Math.max(1, totalQuestions - Math.floor(i / 10));
    const pct = Math.round((scoreVal / totalQuestions) * 100);

    list.push({
      name,
      score: `${scoreVal}/${totalQuestions}`,
      accuracy: `${pct}%`,
    });
  }

  return list;
}

export function useQuizLeaderboard() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams<{
    correct?: string;
    total?: string;
    accuracy?: string;
    timeTaken?: string;
  }>();

  const total = Number(params.total) || 25;
  const correct = params.correct !== undefined ? Number(params.correct) : 20;
  const accuracy =
    params.accuracy !== undefined
      ? Number(params.accuracy)
      : Math.round((correct / total) * 100);
  const incorrect = Math.max(0, total - correct);
  const timeTakenFormatted = params.timeTaken || "28m 11s";

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<LeaderboardFilterValues>({
    trainingType: "Classroom Training",
    state: "Delhi",
    district: "New Delhi",
    zone: "South",
  });
  const [appliedZone, setAppliedZone] = useState("");

  const leaderboardUsers = useMemo(
    () => generateLeaderboardUsers(total, correct, accuracy, appliedZone),
    [total, correct, accuracy, appliedZone],
  );

  const handleApplyFilter = () => {
    setAppliedZone(filterValues.zone);
    setFilterOpen(false);
  };

  const handleContinue = () => {
    router.replace("/session_detail");
  };

  return {
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
  };
}
