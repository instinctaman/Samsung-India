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

export type AssessmentQuestionsResponse = {
  title: string | null;
  testTime: string | null;
  questions: AssessmentQuestion[];
};

// Demo implementations — no network calls.
export { getAssessmentQuestions, submitAssessment } from "@/api/mockService";
export { ApiError } from "@/api/client";

