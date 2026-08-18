import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { SurveyAnswers, SurveyQuestion } from "./types";
import SurveyFooter from "./SurveyFooter";
import SurveyHeader from "./SurveyHeader";
import SurveyQuestionCard from "./SurveyQuestionCard";

export type SurveyModuleProps = {
  questions: SurveyQuestion[];
  title?: string;
  subtitle?: string;
  instruction?: string;
  answers: SurveyAnswers;
  onAnswerChange: (questionId: string | number, value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
  error?: string | null;
};

export default function SurveyModule({
  questions,
  title = "SECs Feedback | June",
  subtitle = "Classroom Training Sessions",
  instruction = "Please review and complete the form below",
  answers,
  onAnswerChange,
  onSubmit,
  submitting = false,
  error = null,
}: SurveyModuleProps) {
  const [unansweredIds, setUnansweredIds] = useState<(string | number)[]>([]);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const handleContinue = () => {
    if (submitting) return;

    // Validate required questions (default required is true unless explicitly false)
    const missing = questions
      .filter((q) => {
        const isRequired = q.required !== false;
        if (!isRequired) return false;
        const val = answers[q.id];
        return !val || val.trim().length === 0;
      })
      .map((q) => q.id);

    if (missing.length > 0) {
      setUnansweredIds(missing);
      setValidationMsg(
        `Please complete all questions before continuing (${missing.length} remaining).`,
      );
      return;
    }

    setUnansweredIds([]);
    setValidationMsg(null);
    onSubmit();
  };

  const handleFieldChange = (id: string | number, val: string) => {
    if (unansweredIds.includes(id)) {
      setUnansweredIds((prev) => prev.filter((item) => item !== id));
      if (unansweredIds.length <= 1) {
        setValidationMsg(null);
      }
    }
    onAnswerChange(id, val);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Summary Card */}
        <SurveyHeader
          title={title}
          subtitle={subtitle}
          instruction={instruction}
        />

        {/* Validation / Submission Error Banner */}
        {(validationMsg || error) && (
          <View style={styles.alertBanner}>
            <Ionicons name="alert-circle" size={16} color={Colors.danger} />
            <AppText
              style={styles.alertText}
              color={Colors.danger}
              weight={FontWeight.medium}
            >
              {validationMsg || error}
            </AppText>
          </View>
        )}

        {/* Question Cards List */}
        {questions.map((question, index) => (
          <SurveyQuestionCard
            key={question.id}
            question={question}
            index={index}
            total={questions.length}
            value={answers[question.id] ?? ""}
            onChange={(val) => handleFieldChange(question.id, val)}
            hasError={unansweredIds.includes(question.id)}
          />
        ))}

        {/* Spacer for Fixed Bottom Footer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Sticky Floating Footer */}
      <SurveyFooter
        title="Continue"
        onContinue={handleContinue}
        loading={submitting}
        disabled={submitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBF3FB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  alertText: {
    fontSize: 12.5,
    flex: 1,
    lineHeight: 17,
  },
  bottomSpacer: {
    height: 80,
  },
});
