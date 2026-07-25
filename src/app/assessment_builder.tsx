import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import AppButton from "@/components/ui/AppButton";
import AppModal from "@/components/ui/AppModal";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Spacing } from "@/theme/spacing";
import { Shadows } from "@/theme/shadows";
import { useAuth } from "@/hooks/useAuth";
import {
  ApiError,
  AssessmentSuiteDetail,
  QuestionOption,
  addAssessmentQuestion,
  createAssessmentSuite,
  deleteAssessmentQuestion,
  fetchAssessmentSuiteDetail,
} from "@/api/training";

const CATEGORY_OPTIONS = ["POST TEST", "SAMSUMG S25", "Survey", "Quiz"];
const TYPE_OPTIONS = ["Quiz", "Test", "Survey"];
const QUESTION_TYPE_OPTIONS = [
  "multiple_choice",
  "checkboxes",
  "dropdown",
  "short_answer",
  "paragraph",
  "date",
  "time",
  "linear_scale",
  "file_upload",
];
const QUESTION_TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Multiple Choice",
  checkboxes: "Checkboxes",
  dropdown: "Dropdown",
  short_answer: "Short Answer",
  paragraph: "Paragraph",
  date: "Date",
  time: "Time",
  linear_scale: "Linear Scale",
  file_upload: "File Upload",
};

export default function AssessmentBuilderScreen() {
  const router = useRouter();
  const { adminToken } = useAuth();
  const { suiteUid: suiteUidParam } = useLocalSearchParams<{ suiteUid?: string }>();

  const [suiteUid, setSuiteUid] = useState<string | null>(suiteUidParam ?? null);
  const [suite, setSuite] = useState<AssessmentSuiteDetail | null>(null);
  const [loading, setLoading] = useState(!!suiteUidParam);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [testTime, setTestTime] = useState("30");
  const [type, setType] = useState("Quiz");
  const [creating, setCreating] = useState(false);

  const [addVisible, setAddVisible] = useState(false);

  const loadSuite = useCallback(async () => {
    if (!adminToken || !suiteUid) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await fetchAssessmentSuiteDetail(adminToken, suiteUid);
      setSuite(detail);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load this assessment.");
    } finally {
      setLoading(false);
    }
  }, [adminToken, suiteUid]);

  useEffect(() => {
    loadSuite();
  }, [loadSuite]);

  const handleCreateSuite = async () => {
    if (!adminToken || !title.trim() || !category) {
      setError("Title and Category are required.");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const created = await createAssessmentSuite(adminToken, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        testTime,
        type,
      });
      setSuiteUid(created.assessmentSuiteUid);
      setSuite(created);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create this assessment.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!adminToken || !suiteUid) return;
    try {
      const updated = await deleteAssessmentQuestion(adminToken, suiteUid, questionId);
      setSuite(updated);
    } catch {
      setError("Couldn't remove that question.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.mainColour1} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={Colors.mainColour1} />
          </Pressable>
          <AppText style={styles.headerTitle} weight={FontWeight.semiBold}>Assessment Builder</AppText>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <AppInput
              placeholder="Untitled Assessment"
              value={suite?.title ?? title}
              onChangeText={setTitle}
              editable={!suite}
            />
            <AppInput
              placeholder="Form description"
              value={suite?.description ?? description}
              onChangeText={setDescription}
              editable={!suite}
            />

            <View style={styles.row}>
              <View style={styles.third}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Category *</AppText>
                {suite ? (
                  <AppText style={styles.readonlyValue}>{suite.category}</AppText>
                ) : (
                  <AppSelect
                    selectedValue={category}
                    onValueChange={setCategory}
                    items={[{ label: "Select Category", value: "" }, ...CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))]}
                  />
                )}
              </View>
              <View style={styles.third}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Time (min) *</AppText>
                {suite ? (
                  <AppText style={styles.readonlyValue}>{suite.testTime ?? "--"}</AppText>
                ) : (
                  <AppInput placeholder="30" keyboardType="number-pad" value={testTime} onChangeText={setTestTime} />
                )}
              </View>
              <View style={styles.third}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Type</AppText>
                {suite ? (
                  <AppText style={styles.readonlyValue}>{suite.type}</AppText>
                ) : (
                  <AppSelect selectedValue={type} onValueChange={setType} items={TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
                )}
              </View>
            </View>

            {error && <AppText style={styles.errorText}>{error}</AppText>}

            {!suite && (
              <AppButton title="Create & Continue" onPress={handleCreateSuite} loading={creating} buttonStyle={styles.createButton} />
            )}
          </View>

          {suite && (
            <>
              {suite.questions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="help-circle-outline" size={32} color={Colors.gray400} />
                  <AppText style={styles.emptyText} color={Colors.gray600}>No questions yet. Tap + to add one.</AppText>
                </View>
              ) : (
                suite.questions.map((q, index) => (
                  <View key={q.id} style={styles.questionCard}>
                    <View style={styles.questionHeaderRow}>
                      <AppText style={styles.questionIndex} color={Colors.mainColour1} weight={FontWeight.semiBold}>
                        Q{index + 1}
                      </AppText>
                      <AppText style={styles.questionTypeTag} color={Colors.gray600}>
                        {QUESTION_TYPE_LABELS[q.questionType] ?? q.questionType}
                      </AppText>
                      <Pressable onPress={() => handleDeleteQuestion(q.id)} hitSlop={8}>
                        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                      </Pressable>
                    </View>
                    <AppText style={styles.questionText} weight={FontWeight.medium}>{q.question}</AppText>
                    {q.options.map((opt) => (
                      <View key={opt.id} style={styles.optionRow}>
                        <Ionicons
                          name={opt.id === q.correctAnswer ? "checkmark-circle" : "ellipse-outline"}
                          size={16}
                          color={opt.id === q.correctAnswer ? Colors.success : Colors.gray400}
                        />
                        <AppText style={styles.optionText}>{opt.text}</AppText>
                      </View>
                    ))}
                    <View style={styles.questionMetaRow}>
                      <AppText style={styles.questionMeta} color={Colors.gray600}>{q.points} pts</AppText>
                      {q.timerSeconds != null && (
                        <AppText style={styles.questionMeta} color={Colors.gray600}>{q.timerSeconds}s</AppText>
                      )}
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </ScrollView>

        {suite && (
          <Pressable style={styles.fab} onPress={() => setAddVisible(true)}>
            <Ionicons name="add" size={26} color={Colors.white} />
          </Pressable>
        )}
      </SafeAreaView>

      {suite && (
        <AddQuestionModal
          visible={addVisible}
          onClose={() => setAddVisible(false)}
          onAdded={(updated) => {
            setSuite(updated);
            setAddVisible(false);
          }}
          adminToken={adminToken}
          suiteUid={suite.assessmentSuiteUid}
        />
      )}
    </>
  );
}

function AddQuestionModal({
  visible,
  onClose,
  onAdded,
  adminToken,
  suiteUid,
}: {
  visible: boolean;
  onClose: () => void;
  onAdded: (suite: AssessmentSuiteDetail) => void;
  adminToken: string | null;
  suiteUid: string;
}) {
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "A", text: "" },
    { id: "B", text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [points, setPoints] = useState("1");
  const [timerSeconds, setTimerSeconds] = useState("");
  const [explanation, setExplanation] = useState("");
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMultipleChoice = questionType === "multiple_choice";

  const addOption = () => {
    const nextId = String.fromCharCode(65 + options.length);
    setOptions((prev) => [...prev, { id: nextId, text: "" }]);
  };

  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    if (correctAnswer === id) setCorrectAnswer("");
  };

  const reset = () => {
    setQuestion("");
    setQuestionType("multiple_choice");
    setOptions([{ id: "A", text: "" }, { id: "B", text: "" }]);
    setCorrectAnswer("A");
    setPoints("1");
    setTimerSeconds("");
    setExplanation("");
    setShowAnswerKey(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!adminToken) return;
    if (!question.trim()) {
      setError("Enter the question text.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await addAssessmentQuestion(adminToken, suiteUid, {
        question: question.trim(),
        questionType,
        options: isMultipleChoice ? options.filter((o) => o.text.trim()) : [],
        correctAnswer: isMultipleChoice ? correctAnswer || undefined : undefined,
        points: Number(points) || 1,
        timerSeconds: timerSeconds ? Number(timerSeconds) : undefined,
        explanation: explanation.trim() || undefined,
      });
      reset();
      onAdded(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't add this question.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal visible={visible} onClose={onClose} position="bottom" title="Add Question" showCloseButton contentStyle={styles.modalSheet}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <AppInput placeholder="Question" value={question} onChangeText={setQuestion} />

        <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Question Type</AppText>
        <AppSelect
          selectedValue={questionType}
          onValueChange={setQuestionType}
          items={QUESTION_TYPE_OPTIONS.map((t) => ({ label: QUESTION_TYPE_LABELS[t], value: t }))}
        />

        {isMultipleChoice && (
          <View style={styles.optionsBuilder}>
            {options.map((opt) => (
              <View key={opt.id} style={styles.optionBuilderRow}>
                <Pressable onPress={() => setCorrectAnswer(opt.id)} hitSlop={8}>
                  <Ionicons
                    name={correctAnswer === opt.id ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={correctAnswer === opt.id ? Colors.success : Colors.gray400}
                  />
                </Pressable>
                <View style={styles.optionInputWrap}>
                  <AppInput
                    placeholder={`Option ${opt.id}`}
                    value={opt.text}
                    onChangeText={(text) => setOptions((prev) => prev.map((o) => (o.id === opt.id ? { ...o, text } : o)))}
                  />
                </View>
                <Pressable onPress={() => removeOption(opt.id)} hitSlop={8}>
                  <Ionicons name="close" size={18} color={Colors.gray400} />
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.addOptionRow} onPress={addOption}>
              <Ionicons name="add" size={16} color={Colors.mainColour1} />
              <AppText style={styles.addOptionText} color={Colors.mainColour1}>Add option</AppText>
            </Pressable>
          </View>
        )}

        <Pressable style={styles.answerKeyToggle} onPress={() => setShowAnswerKey((v) => !v)}>
          <Ionicons name="checkbox-outline" size={16} color={Colors.mainColour1} />
          <AppText style={styles.answerKeyToggleText} color={Colors.mainColour1} weight={FontWeight.medium}>Answer Key</AppText>
          <Ionicons name={showAnswerKey ? "chevron-up" : "chevron-down"} size={16} color={Colors.mainColour1} />
        </Pressable>

        {showAnswerKey && (
          <View style={styles.answerKeyPanel}>
            <View style={styles.row}>
              <View style={styles.half}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium} color={Colors.success}>Points</AppText>
                <AppInput placeholder="1" keyboardType="number-pad" value={points} onChangeText={setPoints} />
              </View>
              <View style={styles.half}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Timer (sec)</AppText>
                <AppInput placeholder="0" keyboardType="number-pad" value={timerSeconds} onChangeText={setTimerSeconds} />
              </View>
            </View>
            <AppText style={styles.fieldLabel} weight={FontWeight.medium}>Answer Explanation</AppText>
            <AppInput placeholder="Why is this answer correct?" value={explanation} onChangeText={setExplanation} />
          </View>
        )}

        {error && <AppText style={styles.errorText}>{error}</AppText>}

        <AppButton title="Add Question" onPress={handleSubmit} loading={saving} />
      </ScrollView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", ...Shadows.card },
  headerTitle: { fontSize: Fonts.h3 },
  content: { padding: 16, paddingTop: 4, gap: 14, paddingBottom: 100 },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xxl, padding: 16, ...Shadows.card, gap: 4 },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  third: { flex: 1 },
  fieldLabel: { fontSize: Fonts.bodySm, marginBottom: Spacing.sm },
  readonlyValue: { fontSize: Fonts.bodySm, color: Colors.gray600, paddingVertical: 12 },
  createButton: { marginTop: 8 },
  errorText: { color: Colors.danger, fontSize: Fonts.bodySm, textAlign: "center", marginVertical: 8 },
  emptyState: { alignItems: "center", gap: 6, paddingVertical: 32 },
  emptyText: { fontSize: Fonts.bodySm, textAlign: "center" },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    borderLeftWidth: 3,
    borderLeftColor: Colors.mainColour1,
    padding: 14,
    gap: 8,
    ...Shadows.card,
  },
  questionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  questionIndex: { fontSize: Fonts.bodySm },
  questionTypeTag: { fontSize: Fonts.overline, flex: 1, backgroundColor: Colors.gray100, alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  questionText: { fontSize: Fonts.body },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingLeft: 4 },
  optionText: { fontSize: Fonts.bodySm },
  questionMetaRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  questionMeta: { fontSize: Fonts.overline },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.mainColour1,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.raised,
  },
  modalSheet: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, maxHeight: "85%" },
  optionsBuilder: { marginTop: 4, gap: 8 },
  optionBuilderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  optionInputWrap: { flex: 1 },
  addOptionRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4 },
  addOptionText: { fontSize: Fonts.bodySm },
  answerKeyToggle: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 10 },
  answerKeyToggleText: { fontSize: Fonts.bodySm, flex: 1 },
  answerKeyPanel: { backgroundColor: Colors.gray100, borderRadius: Radius.xl, padding: 12, gap: 4, marginBottom: 10 },
});
