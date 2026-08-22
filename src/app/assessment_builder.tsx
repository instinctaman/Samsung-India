import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ApiError,
  AssessmentSuiteDetail,
  QuestionOption,
  addAssessmentQuestion,
} from "@/api/training";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppModal from "@/components/ui/AppModal";
import AppSelect from "@/components/ui/AppSelect";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { useAssessmentBuilder } from "@/hooks/useAssessmentBuilder";

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
  const { suiteUid: suiteUidParam } = useLocalSearchParams<{
    suiteUid?: string;
  }>();

  const {
    adminToken,
    suite,
    loading,
    error,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    testTime,
    setTestTime,
    type,
    setType,
    creating,
    addVisible,
    setAddVisible,
    handleCreateSuite,
    handleDeleteQuestion,
    handleQuestionAdded,
  } = useAssessmentBuilder(suiteUidParam);

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
          <Pressable
            style={styles.iconButton}
            onPress={() => router.back()}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.mainColour1} />
          </Pressable>
          <AppText style={styles.headerTitle} weight={FontWeight.semiBold}>
            Assessment Builder
          </AppText>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
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
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  Category *
                </AppText>
                {suite ? (
                  <AppText style={styles.readonlyValue}>
                    {suite.category}
                  </AppText>
                ) : (
                  <AppSelect
                    selectedValue={category}
                    onValueChange={setCategory}
                    items={[
                      { label: "Select Category", value: "" },
                      ...CATEGORY_OPTIONS.map((c) => ({ label: c, value: c })),
                    ]}
                  />
                )}
              </View>
              <View style={styles.third}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  Time (min) *
                </AppText>
                {suite ? (
                  <AppText style={styles.readonlyValue}>
                    {suite.testTime ?? "--"}
                  </AppText>
                ) : (
                  <AppInput
                    placeholder="30"
                    keyboardType="number-pad"
                    value={testTime}
                    onChangeText={setTestTime}
                  />
                )}
              </View>
              <View style={styles.third}>
                <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
                  Type
                </AppText>
                {suite ? (
                  <AppText style={styles.readonlyValue}>{suite.type}</AppText>
                ) : (
                  <AppSelect
                    selectedValue={type}
                    onValueChange={setType}
                    items={TYPE_OPTIONS.map((t) => ({ label: t, value: t }))}
                  />
                )}
              </View>
            </View>

            {error && <AppText style={styles.errorText}>{error}</AppText>}

            {!suite && (
              <AppButton
                title="Create & Continue"
                onPress={handleCreateSuite}
                loading={creating}
                buttonStyle={styles.createButton}
              />
            )}
          </View>

          {suite && (
            <>
              {suite.questions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="help-circle-outline"
                    size={32}
                    color={Colors.gray400}
                  />
                  <AppText style={styles.emptyText} color={Colors.gray600}>
                    No questions yet. Tap + to add one.
                  </AppText>
                </View>
              ) : (
                suite.questions.map((q, index) => (
                  <View key={q.id} style={styles.questionCard}>
                    <View style={styles.questionHeaderRow}>
                      <AppText
                        style={styles.questionIndex}
                        color={Colors.mainColour1}
                        weight={FontWeight.semiBold}
                      >
                        Q{index + 1}
                      </AppText>
                      <AppText
                        style={styles.questionTypeTag}
                        color={Colors.gray600}
                      >
                        {QUESTION_TYPE_LABELS[q.questionType] ?? q.questionType}
                      </AppText>
                      <Pressable
                        onPress={() => handleDeleteQuestion(q.id)}
                        hitSlop={8}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={Colors.danger}
                        />
                      </Pressable>
                    </View>
                    <AppText
                      style={styles.questionText}
                      weight={FontWeight.medium}
                    >
                      {q.question}
                    </AppText>
                    {q.options.map((opt) => (
                      <View key={opt.id} style={styles.optionRow}>
                        <Ionicons
                          name={
                            opt.id === q.correctAnswer
                              ? "checkmark-circle"
                              : "ellipse-outline"
                          }
                          size={16}
                          color={
                            opt.id === q.correctAnswer
                              ? Colors.success
                              : Colors.gray400
                          }
                        />
                        <AppText style={styles.optionText}>{opt.text}</AppText>
                      </View>
                    ))}
                    <View style={styles.questionMetaRow}>
                      <AppText
                        style={styles.questionMeta}
                        color={Colors.gray600}
                      >
                        {q.points} pts
                      </AppText>
                      {q.timerSeconds != null && (
                        <AppText
                          style={styles.questionMeta}
                          color={Colors.gray600}
                        >
                          {q.timerSeconds}s
                        </AppText>
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
          onAdded={handleQuestionAdded}
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
  onAdded: (updated: AssessmentSuiteDetail) => void;
  adminToken: string | null;
  suiteUid: string;
}) {
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [points, setPoints] = useState("1");
  const [timerSeconds, setTimerSeconds] = useState("30");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setQuestion("");
    setQuestionType("multiple_choice");
    setPoints("1");
    setTimerSeconds("30");
    setOptions([
      { id: "1", text: "" },
      { id: "2", text: "" },
    ]);
    setCorrectAnswer("1");
    setError(null);
  };

  const handleAddOption = () => {
    const nextId = String(options.length + 1);
    setOptions((prev) => [...prev, { id: nextId, text: "" }]);
  };

  const handleUpdateOption = (id: string, text: string) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text } : opt)),
    );
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
    if (correctAnswer === id) {
      setCorrectAnswer(options.find((o) => o.id !== id)?.id ?? "1");
    }
  };

  const handleSave = async () => {
    if (!adminToken || !question.trim()) {
      setError("Question text is required.");
      return;
    }
    const cleanOptions = options.filter((o) => o.text.trim());
    if (cleanOptions.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await addAssessmentQuestion(adminToken, suiteUid, {
        question: question.trim(),
        questionType,
        points: Number(points) || 1,
        timerSeconds: Number(timerSeconds) || 30,
        options: cleanOptions,
        correctAnswer,
      });
      reset();
      onAdded(updated);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't add that question.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      visible={visible}
      onClose={() => {
        reset();
        onClose();
      }}
      position="bottom"
      title="Add Question"
      showCloseButton
      contentStyle={styles.sheet}
    >
      <ScrollView
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
      >
        <AppInput
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
        />

        <View style={styles.sheetRow}>
          <View style={styles.sheetHalf}>
            <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
              Type
            </AppText>
            <AppSelect
              selectedValue={questionType}
              onValueChange={setQuestionType}
              items={QUESTION_TYPE_OPTIONS.map((t) => ({
                label: QUESTION_TYPE_LABELS[t] ?? t,
                value: t,
              }))}
            />
          </View>
          <View style={styles.sheetQuarter}>
            <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
              Pts
            </AppText>
            <AppInput
              placeholder="1"
              keyboardType="number-pad"
              value={points}
              onChangeText={setPoints}
            />
          </View>
          <View style={styles.sheetQuarter}>
            <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
              Sec
            </AppText>
            <AppInput
              placeholder="30"
              keyboardType="number-pad"
              value={timerSeconds}
              onChangeText={setTimerSeconds}
            />
          </View>
        </View>

        <AppText
          style={[styles.fieldLabel, { marginTop: 12 }]}
          weight={FontWeight.medium}
        >
          Options (select the correct answer)
        </AppText>
        {options.map((opt, idx) => (
          <View key={opt.id} style={styles.optionInputRow}>
            <Pressable
              onPress={() => setCorrectAnswer(opt.id)}
              hitSlop={8}
              style={styles.radioHit}
            >
              <Ionicons
                name={
                  opt.id === correctAnswer
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={
                  opt.id === correctAnswer
                    ? Colors.mainColour1
                    : Colors.gray400
                }
              />
            </Pressable>
            <View style={styles.optionInputContainer}>
              <AppInput
                placeholder={`Option ${idx + 1}`}
                value={opt.text}
                onChangeText={(text) => handleUpdateOption(opt.id, text)}
              />
            </View>
            {options.length > 2 && (
              <Pressable
                onPress={() => handleRemoveOption(opt.id)}
                hitSlop={8}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color={Colors.gray400}
                />
              </Pressable>
            )}
          </View>
        ))}

        <Pressable style={styles.addOptionButton} onPress={handleAddOption}>
          <Ionicons name="add" size={16} color={Colors.mainColour1} />
          <AppText
            color={Colors.mainColour1}
            weight={FontWeight.medium}
            style={styles.addOptionText}
          >
            Add Option
          </AppText>
        </Pressable>

        {error && <AppText style={styles.errorText}>{error}</AppText>}

        <AppButton
          title="Save Question"
          onPress={handleSave}
          loading={saving}
          buttonStyle={{ marginTop: 16 }}
        />
      </ScrollView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF4FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: Fonts.h3 },
  content: { flexGrow: 1, padding: 16, gap: 14, paddingBottom: 80 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: 16,
    gap: 10,
    ...Shadows.card,
  },
  row: { flexDirection: "row", gap: 10 },
  third: { flex: 1 },
  fieldLabel: { fontSize: Fonts.caption, marginBottom: 4, color: Colors.gray600 },
  readonlyValue: {
    fontSize: Fonts.bodySm,
    paddingVertical: 8,
    color: Colors.gray600,
  },
  createButton: { marginTop: 8 },
  errorText: {
    color: Colors.danger,
    fontSize: Fonts.bodySm,
    textAlign: "center",
  },
  emptyState: { alignItems: "center", gap: 6, paddingVertical: 40 },
  emptyText: { fontSize: Fonts.bodySm },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: 16,
    gap: 8,
    ...Shadows.card,
  },
  questionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionIndex: { fontSize: Fonts.bodySm },
  questionTypeTag: { fontSize: Fonts.overline },
  questionText: { fontSize: Fonts.body, marginVertical: 4 },
  optionRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 2 },
  optionText: { fontSize: Fonts.bodySm },
  questionMetaRow: { flexDirection: "row", gap: 12, marginTop: 6 },
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
  sheet: {
    maxHeight: "85%",
    borderTopLeftRadius: Radius.xxxl,
    borderTopRightRadius: Radius.xxxl,
  },
  sheetContent: { padding: 16, gap: 10 },
  sheetRow: { flexDirection: "row", gap: 8 },
  sheetHalf: { flex: 2 },
  sheetQuarter: { flex: 1 },
  optionInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  radioHit: { padding: 2 },
  optionInputContainer: { flex: 1, marginBottom: 0 },
  addOptionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  addOptionText: { fontSize: Fonts.bodySm },
});
