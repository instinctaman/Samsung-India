import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  ApiError,
  AssessmentQuestion,
  getAssessmentQuestions,
  submitAssessment,
} from "@/api/assessment";
import TestSubmittedView from "@/components/assessment/TestSubmittedView";
import { SurveyAnswers, SurveyModule, SurveyQuestion } from "@/components/survey";
import AppText from "@/components/ui/AppText";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

const FREE_TEXT_TYPES = new Set(["short_answer", "paragraph", "text"]);

export default function SurveyScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { conferenceUid, suiteUid } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
  }>();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [surveyTitle, setSurveyTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [startedAt] = useState(() => new Date());

  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const loadQuestions = useCallback(async () => {
    if (!token || !suiteUid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAssessmentQuestions(token, suiteUid);
      setQuestions(data.questions);
      setSurveyTitle(data.title);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't load the survey.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, suiteUid]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswerChange = (questionId: string | number, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!token || !suiteUid || !conferenceUid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitAssessment(
        token,
        suiteUid,
        conferenceUid,
        questions.map((question) => ({
          questionId: question.id,
          selectedOption: answers[question.id] ?? null,
        })),
      );
      setSubmittedAt(new Date());
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't submit the survey.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const surveyQuestions: SurveyQuestion[] = useMemo(() => {
    return questions.map((q) => ({
      id: q.id,
      question: q.question,
      type: FREE_TEXT_TYPES.has(q.question_type) ? "text" : "single-select",
      options: q.options?.map((opt) => ({ id: opt.id, text: opt.text })) ?? [],
      required: true,
    }));
  }, [questions]);

  // Split title if it contains newline or formatted pipe
  const { headerTitle, headerSubtitle } = useMemo(() => {
    if (!surveyTitle) {
      return {
        headerTitle: "SECs Feedback | June",
        headerSubtitle: "Classroom Training Sessions",
      };
    }
    if (surveyTitle.includes("\n")) {
      const [t, sub] = surveyTitle.split("\n");
      return { headerTitle: t, headerSubtitle: sub };
    }
    return {
      headerTitle: surveyTitle,
      headerSubtitle: "Classroom Training Sessions",
    };
  }, [surveyTitle]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.mainColour1} size="large" />
        <AppText style={styles.loadingText}>Loading the survey…</AppText>
      </SafeAreaView>
    );
  }

  if (error && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText style={styles.loadingText}>{error}</AppText>
        <Pressable style={styles.retryButton} onPress={loadQuestions}>
          <AppText color={Colors.white} weight={FontWeight.medium}>
            Try Again
          </AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (submittedAt) {
    const attempted = Object.keys(answers).filter((key) =>
      answers[key]?.trim(),
    ).length;
    const elapsedSeconds = Math.max(
      Math.round((submittedAt.getTime() - startedAt.getTime()) / 1000),
      0,
    );
    const hh = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const ss = String(elapsedSeconds % 60).padStart(2, "0");

    return (
      <TestSubmittedView
        title="Survey Submitted Successfully!"
        thankYouText="Your feedback has been submitted successfully."
        rows={[
          {
            label: "Survey Title",
            value: headerTitle,
            icon: "document-text",
            iconColor: Colors.success,
            iconBg: "#D8F8EB",
          },
          {
            label: "Date & Time",
            value: `${submittedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}, ${submittedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
            icon: "calendar",
            iconColor: Colors.mainColour1,
            iconBg: "#DDEEFF",
          },
          {
            label: "Duration",
            value: `${hh}:${mm}:${ss}`,
            icon: "time",
            iconColor: "#8B5CF6",
            iconBg: "#EDE4FF",
          },
          {
            label: "Total Questions",
            value: String(questions.length),
            icon: "help-circle",
            iconColor: "#F59E0B",
            iconBg: "#FFF3D6",
          },
          {
            label: "Attempted",
            value: String(attempted),
            icon: "checkmark-done",
            iconColor: Colors.success,
            iconBg: "#D8F8EB",
          },
        ]}
        onGoToDashboard={() => {
          router.replace({
            pathname: "/session_detail",
            params: {
              survey: "completed",
            },
          });
        }}
      />
    );
  }

  return (
    <SurveyModule
      questions={surveyQuestions}
      title={headerTitle}
      subtitle={headerSubtitle}
      instruction="Please review and complete the form below"
      answers={answers}
      onAnswerChange={handleAnswerChange}
      onSubmit={handleSubmit}
      submitting={submitting}
      error={error}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#EBF3FB",
  },
  loadingText: {
    color: Colors.gray600,
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
});
