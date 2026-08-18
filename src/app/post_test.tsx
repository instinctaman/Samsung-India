import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ApiError,
  AssessmentQuestion,
  AssessmentResult,
  getAssessmentQuestions,
  submitAssessment,
  terminateAssessmentWithViolation,
} from "@/api/assessment";

import SecurityLockedView from "@/components/assessment/SecurityLockedView";
import TestSubmittedView from "@/components/assessment/TestSubmittedView";
import ProctoringPanel from "@/components/proctoring/ProctoringPanel";
import ProctoringScreen from "@/components/proctoring/ProctoringScreen";
import SecurityViolationModal from "@/components/proctoring/SecurityViolationModal";
import {
  MAX_PROCTORING_WARNINGS,
  SECURITY_VIOLATIONS,
  SecurityViolationType,
  getSessionViolationCount,
  recordSessionViolation,
} from "@/components/proctoring/violations";
import AppText from "@/components/ui/AppText";
import TimeProgress from "@/components/ui/TimeProgress";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { createShadow } from "@/theme/shadows";

const DEFAULT_TEST_MINUTES = 30;

/** Single controlled status enum — prevents conflicting state transitions */
type PostTestStatus = "active" | "submitting" | "completed" | "security-locked";

export default function PostTestScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { conferenceUid, suiteUid, proctored } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
    proctored?: string;
  }>();

  const [readyToStart, setReadyToStart] = useState(proctored === "true");

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [suiteTitle, setSuiteTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unified post-test status (replaces separate submitting/submittedAt)
  const [testStatus, setTestStatus] = useState<PostTestStatus>("active");
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);

  // Session key for persistent violation tracking
  const sessionKey = conferenceUid || suiteUid || "default-post-test";

  // Violation-specific state (persisted across re-renders for this test session)
  const [violationCount, setViolationCount] = useState(() =>
    getSessionViolationCount(sessionKey),
  );
  const [currentViolation, setCurrentViolation] =
    useState<SecurityViolationType | null>(null);
  const [violationModalVisible, setViolationModalVisible] = useState(false);
  const [lockedViolationType, setLockedViolationType] =
    useState<SecurityViolationType | null>(null);

  // Guards: deduplicate multiple simultaneous violation triggers and double termination
  const terminatingRef = useRef(false);
  const lastViolationTimeRef = useRef(0);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});

  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_TEST_MINUTES * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(
    DEFAULT_TEST_MINUTES * 60,
  );

  const loadQuestions = useCallback(async () => {
    if (!token || !suiteUid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAssessmentQuestions(token, suiteUid);
      setQuestions(data.questions);
      setSuiteTitle(data.title ?? null);
      if (data.testTime) {
        const mins = parseInt(data.testTime, 10);
        if (!isNaN(mins) && mins > 0) {
          setTotalSeconds(mins * 60);
          setRemainingSeconds(mins * 60);
        }
      }
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't load test questions.",
      );
      setLoading(false);
    }
  }, [token, suiteUid]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const current = questions[questionIndex];
  const selectedOption = answers[questionIndex] ?? null;
  const isLastQuestion = questionIndex === questions.length - 1;
  const isActive = testStatus === "active";

  // ── Normal submit (timer expiry or manual submit) ───────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!token || !suiteUid || !conferenceUid) return;
    if (terminatingRef.current) return;
    terminatingRef.current = true;
    setTestStatus("submitting");
    setError(null);
    try {
      const res = await submitAssessment(
        token,
        suiteUid,
        conferenceUid,
        questions.map((question, index) => ({
          questionId: question.id,
          selectedOption: answers[index] ?? null,
        })),
      );
      setAssessmentResult(res);
      setSubmittedAt(new Date());
      setTestStatus("completed");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't submit the test.",
      );
      // Release lock so user can retry
      terminatingRef.current = false;
      setTestStatus("active");
    }
  }, [token, suiteUid, conferenceUid, questions, answers]);

  // ── Security violation termination ─────────────────────────────────────────
  const handleViolationTermination = useCallback(
    async (violationType: SecurityViolationType) => {
      if (terminatingRef.current) return; // already terminating
      terminatingRef.current = true;
      setTestStatus("submitting");
      setLockedViolationType(violationType);

      const answersPayload = questions.map((question, index) => ({
        questionId: question.id,
        selectedOption: answers[index] ?? null,
      }));

      try {
        await terminateAssessmentWithViolation(
          token ?? "",
          suiteUid ?? "",
          conferenceUid ?? "",
          violationType,
          answersPayload,
        );
      } catch {
        // Even if API call fails, lock the test — don't leave trainee in limbo
      } finally {
        setTestStatus("security-locked");
      }
    },
    [token, suiteUid, conferenceUid, questions, answers],
  );

  // ── Central Violation Trigger (0 → 1 → 2 → 3) ───────────────────────────
  const triggerViolation = useCallback(
    (violationType: SecurityViolationType) => {
      // Prevent handling if test is already submitting/locked
      if (testStatus !== "active" || terminatingRef.current) return;

      // Prevent duplicate counts when multiple detection events fire simultaneously (1200ms debounce)
      const now = Date.now();
      if (now - lastViolationTimeRef.current < 1200) return;
      lastViolationTimeRef.current = now;

      const newCount = recordSessionViolation(sessionKey, violationType);
      setViolationCount(newCount);
      setCurrentViolation(violationType);

      if (newCount < MAX_PROCTORING_WARNINGS) {
        // Violation #1 or #2: Open error/violation modal, trainee can close and continue
        setViolationModalVisible(true);
      } else {
        // Violation #3: Stop test immediately, auto submit and lock
        setViolationModalVisible(true);
        handleViolationTermination(violationType);
      }
    },
    [testStatus, sessionKey, handleViolationTermination],
  );

  const handleCloseViolationModal = () => {
    if (violationCount >= MAX_PROCTORING_WARNINGS) {
      router.replace({
        pathname: "/session_detail",
        params: { postTest: "security_locked" },
      });
      return;
    }
    setViolationModalVisible(false);
  };

  // ── Tab-switch detection (Web) ──────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== "web" || !readyToStart) return;

    const handleVisibilityChange = () => {
      if (document.hidden && testStatus === "active" && !terminatingRef.current) {
        triggerViolation(SECURITY_VIOLATIONS.TAB_SWITCH);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [readyToStart, testStatus, triggerViolation]);

  // ── Timer countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!readyToStart || questions.length === 0 || testStatus !== "active")
      return;
    const timer = setInterval(() => {
      setRemainingSeconds((seconds) => (seconds <= 1 ? 0 : seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [readyToStart, questions.length, testStatus]);

  // ── Auto-submit when timer expires ─────────────────────────────────────────
  useEffect(() => {
    if (
      readyToStart &&
      questions.length > 0 &&
      remainingSeconds === 0 &&
      testStatus === "active"
    ) {
      handleSubmit();
    }
  }, [remainingSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsPart = remainingSeconds % 60;
  const totalMinutes = Math.max(Math.ceil(totalSeconds / 60), 1);

  const selectOption = (optionId: string) => {
    if (!isActive) return; // Block selection during/after termination
    setAnswers((items) => ({ ...items, [questionIndex]: optionId }));
  };

  const move = (direction: number) => {
    if (!isActive) return;
    setQuestionIndex((index) =>
      Math.min(Math.max(index + direction, 0), questions.length - 1),
    );
  };

  // ── Screen routing ──────────────────────────────────────────────────────────

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
        <Pressable style={styles.retryButton} onPress={loadQuestions}>
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
        onGoToDashboard={() => {
          const scoreStr = assessmentResult
            ? `${assessmentResult.correctCount}/${assessmentResult.totalQuestions}`
            : `${attempted}/${questions.length || 15}`;
          const durationStr = `Ran : ${hh !== "00" ? `${parseInt(hh)}h ` : ""}${parseInt(mm) || 1}m`;
          router.replace({
            pathname: "/session_detail",
            params: {
              postTest: "completed",
              score: scoreStr,
              duration: durationStr,
            },
          });
        }}
      />
    );
  }

  if (!current) return null;

  const isSubmitting = testStatus === "submitting";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Security Violation Modal (Violations #1, #2, and #3) */}
      <SecurityViolationModal
        visible={violationModalVisible && testStatus !== "security-locked"}
        violationType={currentViolation}
        strikesRemaining={Math.max(MAX_PROCTORING_WARNINGS - violationCount, 0)}
        maxStrikes={MAX_PROCTORING_WARNINGS}
        onClose={handleCloseViolationModal}
        isTerminal={violationCount >= MAX_PROCTORING_WARNINGS}
      />

      {/* Security Locked Overlay (Post test auto-terminated / locked state) */}
      {testStatus === "security-locked" && (
        <SecurityLockedView
          violationType={lockedViolationType || currentViolation}
          onClose={() => {
            router.replace({
              pathname: "/session_detail",
              params: { postTest: "security_locked" },
            });
          }}
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

      <ScrollView contentContainerStyle={styles.content}>
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
              warningsCount={violationCount}
              latestViolation={currentViolation}
              onViolation={triggerViolation}
            />
          </View>
        </View>

        <View style={styles.testTitle}>
          <AppText style={styles.title} weight={FontWeight.semiBold}>
            {suiteTitle ?? "MX Training Offline\nPost Test ( July 2026 )"}
          </AppText>
        </View>

        <View style={styles.questionCard}>
          <View style={styles.tags}>
            <AppText style={styles.questionTag} weight={FontWeight.medium}>
              Question {questionIndex + 1} of {questions.length}
            </AppText>
            <AppText style={styles.multiTag} weight={FontWeight.medium}>
              {current.question_type === "multi" ? "Multi - Select" : "Single Select"}
            </AppText>
            <View style={styles.unlimitedTag}>
              <Ionicons name="infinite" size={13} color="#00A859" />
              <AppText style={styles.unlimitedText} weight={FontWeight.medium}>
                Unlimited
              </AppText>
            </View>
          </View>

          <AppText style={styles.question} weight={FontWeight.semiBold}>
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
                  <AppText style={styles.optionText}>{option.text}</AppText>
                </Pressable>
              );
            })}
          </View>

          {error && <AppText style={styles.inlineError}>{error}</AppText>}

          <View style={styles.actions}>
            <Pressable
              disabled={questionIndex === 0 || !isActive}
              onPress={() => move(-1)}
              style={[
                styles.previousButton,
                (questionIndex === 0 || !isActive) && styles.disabledButton,
              ]}
            >
              <AppText style={styles.previousText}>Previous Question</AppText>
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
    fontSize: Fonts.body,
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
    fontSize: Fonts.bodySm,
    marginTop: 8,
    textAlign: "center",
  },
  header: { backgroundColor: Colors.mainColour1, padding: 9 },
  headerRow: { height: 30, flexDirection: "row", alignItems: "center", gap: 6 },
  timer: {
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 4,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  timerText: { color: Colors.primary, fontSize: Fonts.caption },
  progress: {
    flex: 1,
    height: 22,
    backgroundColor: Colors.white,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    gap: 4,
  },
  progressText: { fontSize: 8, color: Colors.primary },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDEAFF",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  progressPercent: { fontSize: 8, color: Colors.primary },
  headerIcon: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  wifi: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.success,
  },
  content: { padding: 10, gap: 10 },
  timerProctorRow: {
    width: "100%",
    minHeight: 158,
    backgroundColor: Colors.white,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 12,
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.05, elevation: 2 }),
  },
  timerColumn: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  proctorColumn: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  testTitle: {
    borderRadius: 16,
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    ...createShadow({ x: 0, y: 2, blur: 6, opacity: 0.04, elevation: 2 }),
  },
  title: { fontSize: 23, textAlign: "center", lineHeight: 30, color: "#1E293B" },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#60A5FA",
    padding: 16,
    backgroundColor: Colors.white,
    ...createShadow({ x: 0, y: 2, blur: 6, opacity: 0.04, elevation: 2 }),
  },
  tags: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  questionTag: {
    fontSize: 10.5,
    backgroundColor: "#DDEEFF",
    color: "#006AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  multiTag: {
    fontSize: 10.5,
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlimitedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F9F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unlimitedText: {
    fontSize: 10.5,
    color: "#00A859",
  },
  question: { marginTop: 14, fontSize: 16, lineHeight: 22, color: "#111827" },
  options: { gap: 10, marginTop: 14 },
  option: {
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
  },
  optionSelected: { borderColor: "#006AFF", backgroundColor: "#F0F6FF" },
  optionDisabled: { opacity: 0.6 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    borderColor: "#006AFF",
    backgroundColor: "#006AFF",
  },
  optionText: { flex: 1, fontSize: 13, lineHeight: 18, color: "#1F2937" },
  actions: { flexDirection: "row", gap: 10, marginTop: 16 },
  previousButton: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: "#006AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  previousText: {
    color: "#006AFF",
    fontSize: 14.5,
    fontWeight: FontWeight.semiBold,
  },
  disabledButton: { opacity: 0.45 },
  nextButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#006AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: { color: Colors.white, fontSize: 14.5 },
});
