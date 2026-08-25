import { LeaderboardUser } from "./LeaderboardRow";

const OTHER_NAMES = ["Priyanshu Bora", "Ankit Kumar", "Anand Singh", "Ameerul Haque"];

export function buildMockLeaderboardUsers(correctCount: number, totalQuestions: number, accuracy: number): LeaderboardUser[] {
  const nearFullScore = `${Math.max(1, totalQuestions - 1)}/${totalQuestions}`;
  const nearFullAccuracy = `${Math.round(((totalQuestions - 1) / totalQuestions) * 100)}%`;

  const others: LeaderboardUser[] = OTHER_NAMES.map((name, index) =>
    index < 2
      ? { name, score: `${totalQuestions}/${totalQuestions}`, accuracy: "100%" }
      : { name, score: nearFullScore, accuracy: nearFullAccuracy },
  );

  return [
    { name: "You", score: `${correctCount}/${totalQuestions}`, accuracy: `${accuracy}%`, isYou: true },
    ...others,
    ...others,
  ];
}
