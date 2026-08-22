import { FontSize, FontWeight, LineHeight } from "@/theme/typography";
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

import SecurityLockedView from "@/components/assessment/SecurityLockedView";
import TestSubmittedView from "@/components/assessment/TestSubmittedView";
import ProctoringPanel from "@/components/proctoring/OnDeviceProctoringPanel";
import ProctoringScreen from "@/components/proctoring/ProctoringScreen";
import ProctoringSoftWarning from "@/components/proctoring/ProctoringSoftWarning";
import SecurityViolationModal from "@/components/proctoring/SecurityViolationModal";
import { MAX_PROCTORING_WARNINGS } from "@/components/proctoring/violations";
import AppText from "@/components/ui/AppText";
import TimeProgress from "@/components/ui/TimeProgress";
import { usePostTest } from "@/hooks/usePostTest";
import { Colors } from "@/theme/colors";
import { createShadow } from "@/theme/shadows";

export default function PostTestScreen() {
  const { conferenceUid, suiteUid, proctored } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
    proctored?: string;
  }>();

  const {
    token,
    readyToStart,
    setReadyToStart,
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
    violationCount,
    currentViolation,
    violationModalVisible,
    lockedViolationType,
    softWarningType,
    totalSeconds,
    remainingSeconds,
    remainingMinutes,
    remainingSecondsPart,
    totalMinutes,
    answers,
    selectOption,
    move,
    handleSubmit,
    triggerViolation,
    triggerSoftWarning,
    handleCloseViolationModal,
    retry,
    handleGoToDashboard,
    handleSecurityLockedClose,
  } = usePostTest(conferenceUid, suiteUid, proctored);

  if (!readyToStart) {
    return <ProctoringScreen onStartTest={() => setReadyToStart(true)} />;
  }

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
        <Pressable style={styles.retryButton} onPress={retry}>
          <AppText color={Colors.white} weight={FontWeight.medium}>
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
      {/* Security Violation Modal (Strikes 1 & 2 only) */}
      <SecurityViolationModal
        visible={
          violationModalVisible &&
          testStatus === "active" &&
          violationCount < MAX_PROCTORING_WARNINGS
        }
        violationType={currentViolation}
        strikesRemaining={Math.max(MAX_PROCTORING_WARNINGS - violationCount, 0)}
        maxStrikes={MAX_PROCTORING_WARNINGS}
        onClose={handleCloseViolationModal}
        isTerminal={false}
      />

      {/* Soft (non-strike) warning — earlier heads-up before a strike lands */}
      <ProctoringSoftWarning
        visible={!!softWarningType && testStatus === "active"}
        violationType={softWarningType}
      />

      {/* Security Locked Overlay (Post test auto-terminated / locked state) */}
      {testStatus === "security-locked" && (
        <SecurityLockedView
          violationType={lockedViolationType || currentViolation}
          onClose={handleSecurityLockedClose}
        />
      )}

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.timer}>
            <Ionicons name="time-outline" size={14} color={Colors.primary} />
            <AppText style={styles.timerText}>
              {String(remainingMinutes).padStart(2, "0")}:
              {String(remainingSecondsPart).padStart(2, "0")}
            </AppText>
          </View>
          <View style={styles.progress}>
            <AppText style={styles.progressText}>Overall Progress</AppText>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round(((questionIndex + 1) / questions.length) * 100)}%`,
                  },
                ]}
              />
            </View>
            <AppText style={styles.progressPercent}>
              {Math.round(((questionIndex + 1) / questions.length) * 100)}%
            </AppText>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="cloud-outline" size={17} color={Colors.primary} />
          </View>
          <View style={styles.wifi}>
            <Ionicons name="wifi" size={15} color={Colors.white} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timerProctorRow}>
          <View style={styles.timerColumn}>
            <TimeProgress
              totalMinutes={totalMinutes}
              remainingMinutes={remainingMinutes}
              remainingSeconds={remainingSecondsPart}
              size={120}
            />
          </View>
          <View style={styles.proctorColumn}>
            <ProctoringPanel
              token={token}
              active={isActive}
              paused={violationModalVisible || testStatus !== "active"}
              warningsCount={violationCount}
              latestViolation={currentViolation}
              onViolation={triggerViolation}
              onWarning={triggerSoftWarning}
            />
          </View>
        </View>

        <View style={styles.testTitle}>
          <AppText style={styles.title} weight={FontWeight.semiBold}>
            {suiteTitle ?? "MX Training Offline\nPost Test ( July 2026 )"}
          </AppText>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.questionBody}>
            <View style={styles.tags}>
              <View style={styles.questionTagWrapper}>
                <AppText style={styles.questionTag} weight={FontWeight.medium}>
                  Question {questionIndex + 1} of {questions.length}
                </AppText>
              </View>
              <View style={styles.multiTagWrapper}>
                <AppText style={styles.multiTag} weight={FontWeight.medium}>
                  {current.question_type === "multi"
                    ? "Multi – Select"
                    : "Single Select"}
                </AppText>
              </View>
              <View style={styles.unlimitedTag}>
                <Ionicons name="infinite" size={13} color="#00A859" />
                <AppText
                  style={styles.unlimitedText}
                  weight={FontWeight.medium}
                >
                  Unlimited
                </AppText>
              </View>
            </View>

            <AppText style={styles.question} weight={FontWeight.bold}>
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
                          size={13}
                          color={Colors.white}
                        />
                      )}
                    </View>
                    <AppText style={styles.optionText} weight={FontWeight.medium}>
                      {option.text}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {error && <AppText style={styles.inlineError}>{error}</AppText>}
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
              <AppText style={styles.previousText} weight={FontWeight.semiBold}>
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
                  color={Colors.white}
                  weight={FontWeight.semiBold}
                  style={styles.nextText}
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
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: FontSize.label,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  inlineError: {
    color: Colors.danger,
    fontSize: FontSize.caption,
    marginTop: 8,
    textAlign: "center",
  },
  header: { backgroundColor: Colors.mainColour1, padding: 9 },
  headerRow: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timer: {
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  timerText: { color: Colors.primary, fontSize: FontSize.overline },
  progress: {
    flex: 1,
    height: 22,
    backgroundColor: Colors.white,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    gap: 5,
  },
  progressText: { fontSize: FontSize.tiny, color: Colors.black },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray100,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: FontSize.tiny,
    color: Colors.black,
    minWidth: 26,
    textAlign: "right",
  },
  headerIcon: {
    width: 22,
    height: 22,
    borderRadius: 3,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  wifi: {
    width: 22,
    height: 22,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 13,
    gap: 11,
    paddingBottom: 16,
  },
  timerRow: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.06, elevation: 2 }),
  },
  timerProctorRow: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.06, elevation: 2 }),
  },
  timerColumn: { flex: 1, alignItems: "center", justifyContent: "center" },
  proctorColumn: { flex: 1, alignItems: "center", justifyContent: "center" },
  testTitle: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    ...createShadow({
      x: 0,
      y: 2,
      blur: 8,
      opacity: 0.06,
      elevation: 2,
      color: "#000000",
    }),
  },
  title: {
    fontSize: FontSize.body,
    lineHeight: LineHeight.h2,
    textAlign: "center",
    color: "#111827",
  },
  questionCard: {
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#006AFF",
    overflow: "hidden",
    backgroundColor: Colors.white,
    ...createShadow({
      x: 0,
      y: 4,
      blur: 12,
      opacity: 0.08,
      elevation: 4,
      color: "#000000",
    }),
  },
  questionBody: { padding: 14 },
  tags: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  questionTagWrapper: {
    backgroundColor: "#D1E5FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  questionTag: {
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.overline,
    color: "#0066FF",
  },
  multiTagWrapper: {
    backgroundColor: "#F1F3F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  multiTag: {
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.overline,
    color: "#4B5563",
  },
  unlimitedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#D1F2DE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlimitedText: {
    fontSize: FontSize.tiny,
    lineHeight: LineHeight.overline,
    color: "#00A859",
  },
  question: {
    fontSize: 18,
    lineHeight: LineHeight.body,
    color: "#000000",
    marginVertical: 10,
  },
  options: { gap: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  optionSelected: {
    backgroundColor: "#F0F7FF",
    borderColor: "#006AFF",
  },
  optionDisabled: { opacity: 0.6 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    backgroundColor: "#006AFF",
    borderColor: "#006AFF",
  },
  optionText: {
    fontSize: FontSize.label,
    lineHeight: LineHeight.label,
    color: "#000000",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    backgroundColor: Colors.white,
  },
  previousButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.8,
    borderColor: "#006AFF",
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  previousText: {
    fontSize: FontSize.label,
    color: "#006AFF",
  },
  nextButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#006AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: {
    fontSize: FontSize.label,
    color: Colors.white,
  },
  disabledButton: { opacity: 0.5 },
});