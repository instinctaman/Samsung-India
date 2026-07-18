export type QuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
};

// Replace this array with data returned by the quiz API when the backend is ready.
export const quizQuestions: QuizQuestion[] = [
  {
    id: "galaxy-s26-performance",
    question: "Identify the INCORRECT statement about performance with Galaxy S26.",
    options: [
      { id: "A", text: "Powerful 2nm Exynos 2600 Processor" },
      { id: "B", text: "Larger 6.3-inch Dynamic Display" },
      { id: "C", text: "Bigger 4300mAh Battery" },
      { id: "D", text: "None of these" },
    ],
    correctOptionId: "A",
    explanation: "The Galaxy S26 is not equipped with the Exynos 2600 processor.",
  },
  {
    id: "s26-ultra-demo",
    question: "Which feature is NOT part of the S26 Ultra in-store demo?",
    options: [
      { id: "A", text: "Privacy display via live demo" },
      { id: "B", text: "Horizontal lock via live demo" },
      { id: "C", text: "Enhanced Photo Assist via live demo" },
      { id: "D", text: "AI Call screening via live demo" },
    ],
    correctOptionId: "D",
    explanation: "AI Call screening is not included in the S26 Ultra demo flow.",
  },
  {
    id: "galaxy-ai",
    question: "Which Galaxy AI feature helps edit a photo after it is taken?",
    options: [
      { id: "A", text: "Photo Assist" },
      { id: "B", text: "Live Translate" },
      { id: "C", text: "Now Brief" },
      { id: "D", text: "Samsung Wallet" },
    ],
    correctOptionId: "A",
    explanation: "Photo Assist provides AI-powered editing tools for photos.",
  },
];
