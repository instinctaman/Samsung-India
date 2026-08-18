import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import WinImage from "@/assets/images/svg/win.svg";
import LeaderboardFilter, {
  LeaderboardFilterValues,
} from "@/components/quiz/LeaderboardFilter";
import LeaderboardRow, {
  LeaderboardUser,
} from "@/components/quiz/LeaderboardRow";
import PerformanceSummary from "@/components/quiz/PerformanceSummary";
import QuizLiveHeader from "@/components/quiz/QuizLiveHeader";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { createShadow } from "@/theme/shadows";

const SAMPLE_LEADERBOARD_NAMES = [
  "PRIYANSHU BORA",
  "ANKIT KUMAR",
  "ANAND SINGH",
  "AMEERUL HAQUE",
];

function generateLeaderboardUsers(
  totalQuestions: number,
  correctCount: number,
  accuracy: number,
  zoneFilter?: string,
): LeaderboardUser[] {
  const list: LeaderboardUser[] = [
    {
      name: "YOU",
      score: `${correctCount}/${totalQuestions}`,
      accuracy: `${accuracy}%`,
      isYou: true,
    },
  ];

  for (let i = 0; i < 100; i++) {
    const name = SAMPLE_LEADERBOARD_NAMES[i % SAMPLE_LEADERBOARD_NAMES.length];
    const scoreVal =
      i < 6
        ? totalQuestions
        : i < 14
          ? Math.max(1, totalQuestions - 1)
          : Math.max(1, totalQuestions - Math.floor(i / 10));
    const pct = Math.round((scoreVal / totalQuestions) * 100);

    list.push({
      name,
      score: `${scoreVal}/${totalQuestions}`,
      accuracy: `${pct}%`,
    });
  }

  return list;
}

export default function QuizLeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams<{
    correct?: string;
    total?: string;
    accuracy?: string;
    timeTaken?: string;
  }>();

  const total = Number(params.total) || 25;
  const correct = params.correct !== undefined ? Number(params.correct) : 20;
  const accuracy =
    params.accuracy !== undefined
      ? Number(params.accuracy)
      : Math.round((correct / total) * 100);
  const incorrect = Math.max(0, total - correct);
  const timeTakenFormatted = params.timeTaken || "28m 11s";

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<LeaderboardFilterValues>({
    trainingType: "CLASSROOM TRAINING",
    state: "DELHI",
    district: "NEW DELHI",
    zone: "SOUTH",
  });
  const [appliedZone, setAppliedZone] = useState("");

  const leaderboardUsers = useMemo(
    () => generateLeaderboardUsers(total, correct, accuracy, appliedZone),
    [total, correct, accuracy, appliedZone],
  );

  const handleApplyFilter = () => {
    setAppliedZone(filterValues.zone);
    setFilterOpen(false);
  };

  const handleContinue = () => {
    router.replace("/session_detail");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />

      {/* Top Header: Live Quiz */}
      <QuizLiveHeader
        onSync={() => {}}
        onRefresh={() => {}}
        isConnected={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Trophy Illustration Hero */}
        <View style={styles.trophyWrapper}>
          <View style={styles.trophyBanner}>
            <WinImage width={screenWidth} height={133} />
          </View>
          <AppText style={styles.resultsTitle} weight={FontWeight.bold}>
            Results
          </AppText>
          <AppText style={styles.resultsSubtitle}>
            Great attempt! Keep going and improve your score.
          </AppText>
        </View>

        {/* 2. Royal Blue Live Accuracy Hero */}
        <View style={styles.scoreCard}>
          <AppText
            style={styles.scoreLabel}
            color={Colors.white}
            weight={FontWeight.semiBold}
          >
            YOUR LIVE ACCURACY
          </AppText>
          <AppText
            style={styles.scoreValue}
            color={Colors.white}
            weight={FontWeight.bold}
          >
            {accuracy}%
          </AppText>
          <View style={styles.pillsRow}>
            <View style={styles.pillItem}>
              <Ionicons name="disc-outline" size={14} color={Colors.white} />
              <AppText
                style={styles.pillText}
                color={Colors.white}
                weight={FontWeight.semiBold}
              >
                {correct} / {total} Correct
              </AppText>
            </View>
            <View style={styles.pillItem}>
              <Ionicons name="time-outline" size={14} color={Colors.white} />
              <AppText
                style={styles.pillText}
                color={Colors.white}
                weight={FontWeight.semiBold}
              >
                {timeTakenFormatted} taken
              </AppText>
            </View>
          </View>
        </View>

        {/* 3. Performance Summary Card */}
        <PerformanceSummary
          correctCount={correct}
          incorrectCount={incorrect}
          accuracy={accuracy}
          timeTaken="28m"
        />

        {/* 4. Global Top 100 Leaderboard Card */}
        <View style={styles.leaderboardCard}>
          <View style={styles.cardHeader}>
            <View style={styles.titleRow}>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
              <AppText style={styles.cardTitle} weight={FontWeight.bold}>
                GLOBAL TOP 100
              </AppText>
            </View>

            <Pressable
              style={styles.filterBtn}
              onPress={() => setFilterOpen(!filterOpen)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Toggle Leaderboard Filter"
            >
              <AppText
                style={styles.filterBtnText}
                color={Colors.headerBlue}
                weight={FontWeight.semiBold}
              >
                {filterOpen ? "Close" : "Filter"}
              </AppText>
              <Ionicons
                name={filterOpen ? "chevron-down" : "chevron-forward"}
                size={13}
                color={Colors.headerBlue}
              />
            </Pressable>
          </View>

          {/* Expandable Filter Box */}
          {filterOpen && (
            <LeaderboardFilter
              values={filterValues}
              onChangeValues={setFilterValues}
              onApply={handleApplyFilter}
            />
          )}

          {/* Leaderboard Rows */}
          <View style={styles.rowsList}>
            {leaderboardUsers.map((user, index) => (
              <LeaderboardRow
                key={`${user.name}-${user.score}-${index}`}
                user={user}
              />
            ))}
          </View>
        </View>

        {/* 5. Continue Button */}
        <Pressable
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to Dashboard"
        >
          <AppText
            style={styles.continueButtonText}
            color={Colors.white}
            weight={FontWeight.bold}
          >
            Continue
          </AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.headerBlue,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 12,
  },

  // Trophy Illustration Hero
  trophyWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
    paddingBottom: 4,
  },
  trophyBanner: {
    width: "100%",
    height: 133,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: -16,
  },
  resultsTitle: {
    fontSize: 26,
    color: "#111827",
    marginTop: 6,
  },
  resultsSubtitle: {
    fontSize: 12.5,
    color: Colors.gray600,
    textAlign: "center",
    marginTop: 3,
  },

  // Accuracy Hero Card
  scoreCard: {
    backgroundColor: Colors.headerBlue,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    ...createShadow({ x: 0, y: 4, blur: 12, opacity: 0.1, elevation: 3 }),
  },
  scoreLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  scoreValue: {
    fontSize: 42,
    lineHeight: 48,
    marginVertical: 4,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  pillItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11.5,
  },

  // Leaderboard Card
  leaderboardCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...createShadow({ x: 0, y: 2, blur: 8, opacity: 0.06, elevation: 2 }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontSize: 12,
    color: "#1E293B",
    letterSpacing: 0.4,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  filterBtnText: {
    fontSize: 12,
  },
  rowsList: {
    gap: 0,
  },

  // Continue Button
  continueButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.headerBlue,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  continueButtonText: {
    fontSize: 16,
  },
});
