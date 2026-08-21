import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TestSubmittedView from "@/components/assessment/TestSubmittedView";
import AppText from "@/components/ui/AppText";
import TimeProgress from "@/components/ui/TimeProgress";
import { Colors } from "@/theme/colors";
import { FontSize, FontWeight } from "@/theme/typography";
import { createShadow } from "@/theme/shadows";
import { usePostTest } from "@/hooks/usePostTest";

export default function PostTestScreen() {
  const { conferenceUid, suiteUid } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
  }>();

  const {
    questions,
    current,
    questionIndex,
    selectedOption,
    isLastQuestion,
    suiteTitle,
    loading,
    error,
    testStatus,
    isActive,
    isSubmitting,
    submittedAt,
    totalSeconds,
    remainingSeconds,
    remainingMinutes,
    remainingSecondsPart,
    totalMinutes,
    answers,
    selectOption,
    move,
    handleSubmit,
    retry,
    handleGoToDashboard,
  } = usePostTest(conferenceUid, suiteUid);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
        <AppText variant="body" color={Colors.gray600} align="center">
          Loading the test…
        </AppText>
      </SafeAreaView>
    );
  }

  if (error && questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <AppText variant="body" color={Colors.gray600} align="center">
          {error}
        </AppText>
        <Pressable style={styles.retryButton} onPress={retry}>
          <AppText variant="label" color={Colors.white}>
            Try Again
          </AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (testStatus === "completed" && submittedAt) {
    const attempted = Object.keys(answers).length;
    const elapsedSeconds = Math.max(totalSeconds - remainingSeconds, 0);
    const hh = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(
      2,
      "0",
    );
    const ss = String(elapsedSeconds % 60).padStart(2, "0");

    return (
      <TestSubmittedView
        rows={[
          {
            label: "Test Title",
            value: suiteTitle ?? "Standard Test",
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
        onGoToDashboard={handleGoToDashboard}
      />
    );
  }

  if (!current) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerCard}>
          <TimeProgress
            totalMinutes={totalMinutes}
            remainingMinutes={remainingMinutes}
            remainingSeconds={remainingSecondsPart}
            size={130}
          />
        </View>

        <View style={styles.testTitle}>
          <AppText style = {styles.testTitleText} variant="body" >
            {suiteTitle ?? "MX Training Offline\nPost Test ( July 2026 )"}
          </AppText>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.questionBody}>
            <View style={styles.tags}>
              <AppText variant="caption" style={styles.questionText}>
                Question {questionIndex + 1} of {questions.length}
              </AppText>
              <AppText
                variant="caption"
                style={styles.questionType}
                weight={FontWeight.medium}
              >
                {current.question_type === "multi"
                  ? "Multi - Select"
                  : "Single Select"}
              </AppText>
              <View style={styles.unlimitedTag}>
                <Ionicons name="infinite" size={15} color="#00A859" />
                <AppText variant="caption" style={styles.unlimitedTagText}>
                  Unlimited
                </AppText>
              </View>
            </View>

            <AppText
              variant="body"
              weight={FontWeight.semiBold}
              style={styles.question}
            >
              {current.question}
            </AppText>

            <View style={styles.options}>
              {current.options.map((option) => {
                const checked = selectedOption === option.id;
                return (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.option,
                      checked && styles.optionSelected,
                      !isActive && styles.optionDisabled,
                    ]}
                    onPress={() => selectOption(option.id)}
                    disabled={!isActive}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        checked && styles.checkboxSelected,
                      ]}
                    >
                      {checked && (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={Colors.white}
                        />
                      )}
                    </View>
                    <AppText variant="bodySmall" style={styles.optionText}>
                      {option.text}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {error && (
              <AppText
                variant="caption"
                color={Colors.danger}
                align="center"
                style={styles.inlineError}
              >
                {error}
              </AppText>
            )}
          </View>

          <View style={styles.actions}>
            <Pressable
              disabled={questionIndex === 0 || !isActive}
              onPress={() => move(-1)}
              style={[
                styles.previousButton,
                (questionIndex === 0 || !isActive) && styles.disabledButton,
              ]}
            >
              <AppText
                variant="label"
                color={Colors.gray600}
                weight={FontWeight.semiBold}
              >
                Previous Question
              </AppText>
            </Pressable>

            <Pressable
              disabled={isSubmitting || !isActive}
              onPress={() => (isLastQuestion ? handleSubmit() : move(1))}
              style={[
                styles.nextButton,
                (isSubmitting || !isActive) && styles.disabledButton,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <AppText
                  variant="label"
                  color={Colors.white}
                  weight={FontWeight.semiBold}
                >
                  {isLastQuestion ? "Submit Test" : "Next Question"}
                </AppText>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background},
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  inlineError: {
    marginTop: 8,
  },
  content: { flexGrow: 1, padding: 13, gap: 11, paddingBottom: 28 },
  timerCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.06, elevation: 2 }),
  },
  testTitle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderColor: "#006AFF",
    backgroundColor: "#ffffff",
    ...createShadow({
      x: 0,
      y: -6,
      blur: 14,
      opacity: 0.12,
      elevation: 4,
      color: "#000000",
    }),
  },
  testTitleText : {
    fontSize: 23, 
    alignItems: "center",
    paddingInline: 20,
  },
  questionCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    ...createShadow({
      x: 0,
      y: -8,
      blur: 16,
      opacity: 0.14,
      elevation: 6,
      color: "#000000",
    }),
  },
  questionBody: { 
    padding: 14 },
    
  tags: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 9,
    flexWrap: "wrap",
  },
  questionText: {
    fontSize: 10.5,
    color: "#006AFF",
    backgroundColor: "#006AFF20",
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  questionType: {
    color: "#595959",
    fontSize: FontSize.caption,
    backgroundColor: "#C5C5C5",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  unlimitedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#1cb07c24",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  unlimitedTagText: {
    color: "#00A859",
    fontSize: 10.5,
    fontWeight: FontWeight.medium,
  },
  question: {
    marginBottom: 12,
    fontSize: FontSize.body,
  },
  options: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    minHeight: 56,
    borderWidth: 2,
    borderColor: "#c1c1c1",
    gap: 18,
  },
  optionSelected: {
    backgroundColor: "#DCE8FE",
    borderColor: Colors.primary,
  },
  optionDisabled: { opacity: 0.6 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: { flex: 1, fontSize: 13 },
  actions: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  previousButton: {
    flex: 1,
    height: 45,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    flex: 1,
    height: 45,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: { opacity: 0.5 },
});
