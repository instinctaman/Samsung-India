import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { useAuth } from "@/hooks/useAuth";
import { AssessmentQuestion, ApiError, getAssessmentQuestions, submitAssessment } from "@/api/assessment";

export default function PostTestScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { conferenceUid, suiteUid } = useLocalSearchParams<{ conferenceUid: string; suiteUid: string }>();

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  const loadQuestions = useCallback(async () => {
    if (!token || !suiteUid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAssessmentQuestions(token, suiteUid);
      setQuestions(data);
      setQuestionIndex(0);
      setAnswers({});
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load the test questions.");
    } finally {
      setLoading(false);
    }
  }, [token, suiteUid]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const current = questions[questionIndex];
  const selectedOption = answers[questionIndex] ?? null;
  const isLastQuestion = questionIndex + 1 === questions.length;

  const selectOption = (optionId: string) => setAnswers((items) => ({ ...items, [questionIndex]: optionId }));
  const move = (direction: number) => setQuestionIndex((index) => Math.min(Math.max(index + direction, 0), questions.length - 1));

  const handleSubmit = async () => {
    if (!token || !suiteUid || !conferenceUid) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitAssessment(
        token,
        suiteUid,
        conferenceUid,
        questions.map((question, index) => ({ questionId: question.id, selectedOption: answers[index] ?? null }))
      );
      router.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't submit the test.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <AppText style={styles.loadingText}>Loading the test…</AppText>
      </SafeAreaView>
    );
  }

  if (error && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText style={styles.loadingText}>{error}</AppText>
        <Pressable style={styles.retryButton} onPress={loadQuestions}>
          <AppText color={Colors.white} weight={FontWeight.medium}>Try Again</AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!current) return null;

  return <SafeAreaView style={styles.container} edges={["top", "bottom"]}><View style={styles.header}><View style={styles.headerRow}><View style={styles.timer}><Ionicons name="time-outline" size={14} color={Colors.primary} /><AppText style={styles.timerText}>--:--</AppText></View><View style={styles.progress}><AppText style={styles.progressText}>Overall Progress</AppText><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.round(((questionIndex + 1) / questions.length) * 100)}%` }]} /></View><AppText style={styles.progressPercent}>{Math.round(((questionIndex + 1) / questions.length) * 100)}%</AppText></View><View style={styles.headerIcon}><Ionicons name="cloud-outline" size={17} color={Colors.primary} /></View><View style={styles.wifi}><Ionicons name="wifi" size={15} color={Colors.white} /></View></View></View><ScrollView contentContainerStyle={styles.content}><View style={styles.banner} /><View style={styles.testTitle}><AppText style={styles.title} weight={FontWeight.medium}>Standard Test</AppText></View><View style={styles.questionCard}><View style={styles.tags}><AppText style={styles.questionTag} color={Colors.primary}>Question {questionIndex + 1} of {questions.length}</AppText><AppText style={styles.multiTag}>Single Select</AppText></View><AppText style={styles.question} weight={FontWeight.medium}>{current.question}</AppText><View style={styles.options}>{current.options.map((option) => { const checked = selectedOption === option.id; return <Pressable key={option.id} style={[styles.option, checked && styles.optionSelected]} onPress={() => selectOption(option.id)}><View style={[styles.checkbox, checked && styles.checkboxSelected]}>{checked && <Ionicons name="checkmark" size={15} color={Colors.white} />}</View><AppText style={styles.optionText}>{option.text}</AppText></Pressable>; })}</View>{error && <AppText style={styles.inlineError}>{error}</AppText>}<View style={styles.actions}><Pressable disabled={questionIndex === 0} onPress={() => move(-1)} style={[styles.previousButton, questionIndex === 0 && styles.disabledButton]}><AppText style={styles.previousText}>Previous Question</AppText></Pressable><Pressable disabled={submitting} onPress={() => isLastQuestion ? handleSubmit() : move(1)} style={[styles.nextButton, submitting && styles.disabledButton]}>{submitting ? <ActivityIndicator color={Colors.white} /> : <AppText color={Colors.white} weight={FontWeight.semiBold}>{isLastQuestion ? "Submit Test" : "Next Question"}</AppText>}</Pressable></View></View></ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 24 },
  loadingText: { fontSize: Fonts.body, color: Colors.gray600, textAlign: "center" },
  retryButton: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  inlineError: { color: Colors.danger, fontSize: Fonts.bodySm, marginTop: 8, textAlign: "center" },
  header: { backgroundColor: Colors.mainColour1, padding: 9 }, headerRow: { height: 30, flexDirection: "row", alignItems: "center", gap: 6 }, timer: { height: 22, paddingHorizontal: 6, borderRadius: 4, backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", gap: 3 }, timerText: { color: Colors.primary, fontSize: Fonts.caption }, progress: { flex: 1, height: 22, backgroundColor: Colors.white, borderRadius: 4, flexDirection: "row", alignItems: "center", paddingHorizontal: 5, gap: 4 }, progressText: { fontSize: 8, color: Colors.primary }, progressTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#DDEAFF" }, progressFill: { height: "100%", borderRadius: 2, backgroundColor: Colors.primary }, progressPercent: { fontSize: 8, color: Colors.primary }, headerIcon: { width: 22, height: 22, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: Colors.white }, wifi: { width: 22, height: 22, borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: Colors.success }, content: { padding: 10, gap: 8 }, banner: { height: 100, borderRadius: 10, borderWidth: 3, borderColor: "#119AFF", backgroundColor: Colors.white }, testTitle: { borderRadius: 9, backgroundColor: Colors.white, padding: 12, alignItems: "center" }, title: { fontSize: Fonts.h3, textAlign: "center", lineHeight: 23 }, questionCard: { borderRadius: 9, borderWidth: 1, borderColor: "#9AD2FF", padding: 10, backgroundColor: Colors.white }, tags: { flexDirection: "row", gap: 5 }, questionTag: { fontSize: Fonts.overline, backgroundColor: "#DDEEFF", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3 }, multiTag: { fontSize: Fonts.overline, backgroundColor: Colors.gray100, color: Colors.gray600, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3 }, question: { marginTop: 10, fontSize: Fonts.body, lineHeight: 19 }, options: { gap: 8, marginTop: 12 }, option: { minHeight: 42, borderWidth: 1, borderColor: Colors.gray200, borderRadius: 6, padding: 8, flexDirection: "row", alignItems: "center", gap: 12 }, optionSelected: { borderColor: Colors.primary, backgroundColor: "#EEF5FF" }, checkbox: { width: 15, height: 15, borderWidth: 1, borderColor: Colors.gray400, borderRadius: 3, alignItems: "center", justifyContent: "center" }, checkboxSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary }, optionText: { flex: 1, fontSize: Fonts.caption }, actions: { flexDirection: "row", gap: 10, marginTop: 14 }, previousButton: { flex: 1, height: 38, borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, justifyContent: "center", alignItems: "center" }, previousText: { color: Colors.primary, fontWeight: FontWeight.semiBold }, disabledButton: { opacity: 0.45 }, nextButton: { flex: 1, height: 38, borderRadius: 8, backgroundColor: Colors.primary, justifyContent: "center", alignItems: "center" },
});
