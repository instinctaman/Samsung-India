import { apiRequest } from "./client";

export type AssessmentQuestion = {
  id: number;
  question: string;
  question_type: string;
  sort_order: number;
  options: { id: string; text: string }[];
};

export type AssessmentAnswer = {
  questionId: number;
  selectedOption: string | null;
};

export type AssessmentResult = {
  totalScore: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
};

export function getAssessmentQuestions(token: string, suiteUid: string) {
  return apiRequest<AssessmentQuestion[]>(`/assessments/${suiteUid}/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function submitAssessment(
  token: string,
  suiteUid: string,
  conferenceUid: string,
  answers: AssessmentAnswer[]
) {
  return apiRequest<AssessmentResult>(`/assessments/${suiteUid}/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conferenceUid, answers }),
  });
}

export { ApiError } from "./client";
