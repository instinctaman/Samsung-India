import { ScrollView, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { createShadow } from "@/theme/shadows";
import AssessmentMapHeader from "./AssessmentMapHeader";
import { MapActions, StatsRow, StatusLegend } from "./assessment-map";
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
  const answeredCount = Object.keys(answers).length;
  const expiredCount = Object.values(answers).filter((a) => a === null).length;
  const attemptedCount = answeredCount - expiredCount;
  const skippedCount = Math.max(0, totalQuestions - answeredCount);
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 100;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <AssessmentMapHeader timeLeftFormatted={timeLeftFormatted} progressPercentage={progressPercent} onSync={onSync} />

      <View style={styles.card}>
        <View style={styles.hero}>
          <AppText style={styles.heroTitle} color={Colors.white} weight={FontWeight.bold}>
            Assessment Map
          </AppText>
          <AppText style={styles.heroSubtitle} color={Colors.white}>
            Review your attempts before final submission
          </AppText>
        </View>

        <View style={styles.cardBody}>
          <StatsRow attemptedCount={attemptedCount} skippedCount={skippedCount} expiredCount={expiredCount} />
          <StatusLegend />

          <QuestionStatusGrid
            totalQuestions={totalQuestions}
            answers={answers}
            currentIndex={currentIndex}
            onSelectQuestion={onSelectQuestion}
          />

          <View style={styles.cardDivider} />

          <MapActions onReviewQuestions={onReviewQuestions} onSubmit={onSubmit} submitting={submitting} />
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
  cardDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 18,
    marginBottom: 16,
  },
});
