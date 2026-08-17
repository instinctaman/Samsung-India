import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ApiError,
  AssessmentQuestion,
  getAssessmentQuestions,
  submitAssessment,
} from "@/api/assessment";
import TestSubmittedView from "@/components/assessment/TestSubmittedView";
import AppText from "@/components/ui/AppText";
import ScreenBanner from "@/components/ui/ScreenBanner";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";

const FREE_TEXT_TYPES = new Set(["short_answer", "paragraph"]);

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

  const [answers, setAnswers] = useState<Record<number, string>>({});

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

  const setAnswer = (questionIndex: number, value: string) =>
    setAnswers((current) => ({ ...current, [questionIndex]: value }));

  const handleSubmit = async () => {
    if (!token || !suiteUid || !conferenceUid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitAssessment(
        token,
        suiteUid,
        conferenceUid,
        questions.map((question, index) => ({
          questionId: question.id,
          selectedOption: answers[index] ?? null,
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
      answers[Number(key)]?.trim(),
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
        thankYouText="Your Answers has been submitted successfully."
        rows={[
          {
            label: "Survey Title",
            value: surveyTitle ?? "Feedback Survey",
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
        onGoToDashboard={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenBanner backgroundColor={Colors.mainColour1}>
        <AppText
          style={styles.bannerTitle}
          color={Colors.white}
          weight={FontWeight.semiBold}
          numberOfLines={2}
        >
          {surveyTitle ?? "Feedback Survey"}
        </AppText>
      </ScreenBanner>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionCard}>
            <AppText style={styles.questionTag} color={Colors.mainColour1}>
              Question {index + 1} of {questions.length}
            </AppText>
            <AppText style={styles.question} weight={FontWeight.medium}>
              {question.question}
            </AppText>

            {FREE_TEXT_TYPES.has(question.question_type) ? (
              <TextInput
                style={styles.textInput}
                placeholder="Type your response here"
                placeholderTextColor={Colors.gray400}
                value={answers[index] ?? ""}
                onChangeText={(value) => setAnswer(index, value)}
                multiline
              />
            ) : (
              <View style={styles.options}>
                {question.options.map((option) => {
                  const selected = answers[index] === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      style={[styles.option, selected && styles.optionSelected]}
                      onPress={() => setAnswer(index, option.id)}
                    >
                      <View
                        style={[styles.radio, selected && styles.radioSelected]}
                      >
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <AppText style={styles.optionText}>{option.text}</AppText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        ))}

        {error && <AppText style={styles.inlineError}>{error}</AppText>}

        <Pressable
          style={[styles.submitButton, submitting && styles.disabledButton]}
          disabled={submitting}
          onPress={handleSubmit}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <AppText color={Colors.white} weight={FontWeight.semiBold}>
              Continue
            </AppText>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  bannerTitle: { fontSize: Fonts.h3, lineHeight: 22 },

  content: { padding: 14, gap: 12, paddingBottom: 28 },
  questionCard: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  questionTag: {
    alignSelf: "flex-start",
    fontSize: Fonts.overline,
    backgroundColor: "#DDEEFF",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  question: { marginTop: 8, fontSize: Fonts.bodySm, lineHeight: 19 },

  options: { marginTop: 10, gap: 8 },
  option: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionSelected: {
    borderColor: Colors.mainColour1,
    backgroundColor: "#EEF4FF",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: Colors.mainColour1 },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.mainColour1,
  },
  optionText: { flex: 1, fontSize: Fonts.bodySm },

  textInput: {
    marginTop: 10,
    minHeight: 84,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 8,
    padding: 12,
    fontSize: Fonts.bodySm,
    color: Colors.black,
    textAlignVertical: "top",
  },

  inlineError: {
    color: Colors.danger,
    fontSize: Fonts.bodySm,
    textAlign: "center",
  },

  submitButton: {
    height: 48,
    borderRadius: Radius.xl,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  disabledButton: { opacity: 0.6 },
});
