import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { createShadow } from "@/theme/shadows";
import AssessmentMapHeader from "./AssessmentMapHeader";
import QuestionStatusGrid from "./QuestionStatusGrid";

export type AssessmentMapProps = {
  totalQuestions: number;
  answers: Record<number, string | null>;
  currentIndex?: number;
  onSelectQuestion: (index: number) => void;
  onReviewQuestions: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  timeLeftFormatted?: string;
  onSync?: () => void;
};

export default function AssessmentMap({
  totalQuestions,
  answers,
  currentIndex = 0,
  onSelectQuestion,
  onReviewQuestions,
  onSubmit,
  submitting = false,
  timeLeftFormatted = "06:59",
  onSync,
}: AssessmentMapProps) {
  // Compute counts
  const answeredCount = Object.keys(answers).length;
  const expiredCount = Object.values(answers).filter((a) => a === null).length;
  const attemptedCount = answeredCount - expiredCount;
  const skippedCount = Math.max(0, totalQuestions - answeredCount);
  const progressPercent =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 100;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Top Assessment Map Header */}
      <AssessmentMapHeader
        timeLeftFormatted={timeLeftFormatted}
        progressPercentage={progressPercent}
        onSync={onSync}
      />

      {/* 2. Main Assessment Map Card */}
      <View style={styles.card}>
        {/* Blue Hero Header */}
        <View style={styles.hero}>
          <AppText
            style={styles.heroTitle}
            color={Colors.white}
            weight={FontWeight.bold}
          >
            Assessment Map
          </AppText>
          <AppText style={styles.heroSubtitle} color={Colors.white}>
            Review your attempts before final submission
          </AppText>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Stats Row (Done, Skipped, Expired) */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <AppText
                style={[styles.statValue, { color: Colors.recordedGreen }]}
                weight={FontWeight.bold}
              >
                {attemptedCount}
              </AppText>
              <AppText style={styles.statLabel} weight={FontWeight.bold}>
                DONE
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <AppText
                style={[styles.statValue, { color: "#FBBF24" }]}
                weight={FontWeight.bold}
              >
                {skippedCount}
              </AppText>
              <AppText style={styles.statLabel} weight={FontWeight.bold}>
                SKIPPED
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <AppText
                style={[styles.statValue, { color: Colors.danger }]}
                weight={FontWeight.bold}
              >
                {expiredCount}
              </AppText>
              <AppText style={styles.statLabel} weight={FontWeight.bold}>
                EXPIRED
              </AppText>
            </View>
          </View>

          {/* Status Legend Row */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: Colors.recordedGreen },
                ]}
              />
              <AppText style={styles.legendText} weight={FontWeight.medium}>
                Attempted
              </AppText>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#FBBF24" }]}
              />
              <AppText style={styles.legendText} weight={FontWeight.medium}>
                Skipped
              </AppText>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: Colors.danger }]}
              />
              <AppText style={styles.legendText} weight={FontWeight.medium}>
                Timed Out
              </AppText>
            </View>
          </View>

          {/* 5-Column Question Grid */}
          <QuestionStatusGrid
            totalQuestions={totalQuestions}
            answers={answers}
            currentIndex={currentIndex}
            onSelectQuestion={onSelectQuestion}
          />

          {/* Bottom Divider */}
          <View style={styles.cardDivider} />

          {/* Action Buttons */}
          <Pressable
            style={styles.reviewButton}
            onPress={onReviewQuestions}
            accessibilityRole="button"
            accessibilityLabel="Review Questions"
          >
            <AppText color={Colors.white} weight={FontWeight.bold}>
              Review Questions
            </AppText>
          </Pressable>

          <Pressable
            style={[styles.submitButton, submitting && styles.buttonDisabled]}
            disabled={submitting}
            onPress={onSubmit}
            accessibilityRole="button"
            accessibilityLabel="Final Submit"
          >
            {submitting ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <AppText color={Colors.white} weight={FontWeight.bold}>
                Final Submit
              </AppText>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 14,
    overflow: "hidden",
    ...createShadow({ x: 0, y: 4, blur: 10, opacity: 0.08, elevation: 3 }),
  },
  hero: {
    backgroundColor: Colors.headerBlue,
    paddingVertical: 18,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 22,
  },
  heroSubtitle: {
    fontSize: 12,
    marginTop: 3,
    opacity: 0.9,
  },
  cardBody: {
    padding: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statCol: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    lineHeight: 30,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray600,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#E5E7EB",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#1F2937",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 18,
    marginBottom: 16,
  },
  reviewButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.headerBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#008744",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
