import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QuizHeader from "@/components/quiz/QuizHeader";
import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import { Radius } from "@/theme/radius";

const BASE_NAMES = [
  "PRIYANSHU BORA",
  "ANKIT KUMAR",
  "ANAND SINGH",
  "AMEERUL HAQUE",
];

function buildRanking(total: number) {
  const rows: { rank: number; name: string; score: string; percent: number }[] =
    [];
  for (let i = 0; i < 100; i++) {
    const percent = Math.max(100 - i * 2, 40);
    const correct = Math.round((percent / 100) * total);
    rows.push({
      rank: i + 1,
      name: BASE_NAMES[i % BASE_NAMES.length],
      score: `${correct}/${total}`,
      percent,
    });
  }
  return rows;
}

export default function QuizLeaderboardScreen() {
  const params = useLocalSearchParams<{
    correct?: string;
    total?: string;
    accuracy?: string;
  }>();
  const total = Number(params.total) || 25;
  const correct = Number(params.correct) || 0;
  const accuracy = Number(params.accuracy) || 0;
  const incorrect = Math.max(total - correct, 0);

  const [trainingType, setTrainingType] = useState("Classroom Training");
  const [state, setState] = useState("Delhi");
  const [district, setDistrict] = useState("New Delhi");
  const [zone, setZone] = useState("South");

  const ranking = useMemo(() => buildRanking(total), [total]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <QuizHeader onReset={() => {}} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scoreCard}>
          <AppText style={styles.scoreLabel} color={Colors.white}>
            YOUR LIVE ACCURACY
          </AppText>
          <AppText
            style={styles.scoreValue}
            color={Colors.white}
            weight={FontWeight.semiBold}
          >
            {accuracy}%
          </AppText>
          <View style={styles.scorePillRow}>
            <View style={styles.scorePill}>
              <Ionicons
                name="checkmark-circle-outline"
                size={12}
                color={Colors.white}
              />
              <AppText style={styles.scorePillText} color={Colors.white}>
                {correct} / {total} Correct
              </AppText>
            </View>
            <View style={styles.scorePill}>
              <Ionicons name="time-outline" size={12} color={Colors.white} />
              <AppText style={styles.scorePillText} color={Colors.white}>
                23m Time Taken
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.summary}>
          <AppText weight={FontWeight.semiBold}>PERFORMANCE SUMMARY</AppText>
          <View style={styles.summaryRow}>
            <SummaryStat
              icon="checkmark-circle"
              color={Colors.success}
              value={String(correct)}
            />
            <SummaryStat
              icon="close-circle"
              color={Colors.danger}
              value={String(incorrect)}
            />
            <SummaryStat
              icon="stats-chart"
              color="#E5B800"
              value={`${accuracy}%`}
            />
            <SummaryStat icon="time" color={Colors.primary} value="28m" />
          </View>
        </View>

        <View style={styles.filterCard}>
          <AppText style={styles.filterTitle} weight={FontWeight.semiBold}>
            ♛ GLOBAL TOP 100
          </AppText>

          <AppInput
            label="TRAINING TYPE"
            value={trainingType}
            onChangeText={setTrainingType}
          />
          <View style={styles.filterRow}>
            <View style={styles.filterCol}>
              <AppInput label="STATE" value={state} onChangeText={setState} />
            </View>
            <View style={styles.filterCol}>
              <AppInput
                label="DISTRICT"
                value={district}
                onChangeText={setDistrict}
              />
            </View>
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterCol}>
              <AppInput label="ZONE" value={zone} onChangeText={setZone} />
            </View>
            <View style={styles.filterCol}>
              <View style={styles.filterButton}>
                <AppText color={Colors.white} weight={FontWeight.semiBold}>
                  FILTER
                </AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.rankingCard}>
          <View style={[styles.rankRow, styles.youRankRow]}>
            <View style={styles.avatar} />
            <AppText style={styles.rankName} weight={FontWeight.semiBold}>
              YOU
            </AppText>
            <AppText style={[styles.rankPercent, { color: Colors.primary }]}>
              {correct}/{total} ({accuracy}%)
            </AppText>
          </View>
          {ranking.map((row, index) => (
            <View key={row.rank} style={styles.rankRow}>
              <AppText style={styles.rankNumber} color={Colors.gray600}>
                {row.rank}
              </AppText>
              <View style={styles.avatar} />
              <AppText style={styles.rankName}>{row.name}</AppText>
              <AppText
                style={[
                  styles.rankPercent,
                  { color: index % 2 === 0 ? Colors.success : Colors.primary },
                ]}
              >
                {row.score} ({row.percent}%)
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryStat({
  icon,
  color,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  value: string;
}) {
  return (
    <View style={styles.summaryStat}>
      <Ionicons name={icon} size={22} color={color} />
      <AppText style={styles.summaryStatValue} weight={FontWeight.semiBold}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },
  content: { paddingHorizontal: 14, paddingBottom: 24 },

  scoreCard: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 16,
  },
  scoreLabel: { fontSize: Fonts.overline },
  scoreValue: { fontSize: Fonts.br, lineHeight: 40 },
  scorePillRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scorePillText: { fontSize: Fonts.overline },

  summary: {
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
  },
  summaryStat: { alignItems: "center", gap: 4 },
  summaryStatValue: { fontSize: Fonts.h3 },

  filterCard: {
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 14,
  },
  filterTitle: { marginBottom: 8 },
  filterRow: { flexDirection: "row", gap: 10 },
  filterCol: { flex: 1 },
  filterButton: {
    height: 50,
    marginTop: 22,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  rankingCard: {
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
  },
  rankRow: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    paddingVertical: 6,
  },
  youRankRow: {
    backgroundColor: "#DDEAFF",
    borderRadius: 6,
    borderBottomWidth: 0,
    paddingHorizontal: 6,
    marginBottom: 4,
  },
  rankNumber: { width: 20, fontSize: Fonts.overline, textAlign: "center" },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#D9E6FE",
  },
  rankName: { flex: 1, fontSize: Fonts.caption },
  rankPercent: { fontSize: Fonts.overline, fontWeight: FontWeight.semiBold },
});
