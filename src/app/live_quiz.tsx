import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuizLiveHeader, QuizWaiting } from "@/components/quiz";
import LiveQuizQuestionView from "@/components/quiz/LiveQuizQuestionView";
import AppText from "@/components/ui/AppText";
import { useLiveQuiz } from "@/hooks/useLiveQuiz";
import { Colors } from "@/theme/colors";

export default function LiveQuizScreen() {
  const { view, loadError, selectedOption, locked, secondsLeft, selectOption, refetch, router } = useLiveQuiz();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <QuizLiveHeader onRefresh={refetch} isConnected showConnectionLabel={view?.state !== "QUESTION_LIVE"} />

      <View style={styles.body}>
        {loadError && !view ? (
          <Centered>
            <AppText color={Colors.gray600} align="center">{loadError}</AppText>
            <Pressable style={styles.retry} onPress={refetch}>
              <AppText color={Colors.white}>Retry</AppText>
            </Pressable>
          </Centered>
        ) : view?.state === "QUESTION_LIVE" && view.question ? (
          <LiveQuizQuestionView
            question={view.question}
            secondsLeft={secondsLeft}
            selectedOption={selectedOption}
            locked={locked}
            onSelect={selectOption}
          />
        ) : view?.state === "LEADERBOARD" ? (
          <Centered>
            <AppText style={styles.big} weight="bold">Leaderboard</AppText>
            <AppText color={Colors.gray600} align="center">Check the main screen for the standings.</AppText>
          </Centered>
        ) : view?.state === "FINISHED" ? (
          <Centered>
            <AppText style={styles.big} weight="bold">Quiz complete</AppText>
            <AppText color={Colors.gray600} align="center">Returning to your session…</AppText>
          </Centered>
        ) : (
          <QuizWaiting onSyncNow={refetch} />
        )}
      </View>

      <Pressable style={styles.exit} onPress={() => router.replace("/session_detail")}>
        <AppText color={Colors.gray600}>Leave</AppText>
      </Pressable>
    </SafeAreaView>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  body: { flex: 1, minHeight: 0 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 24 },
  big: { fontSize: 20 },
  retry: { backgroundColor: Colors.headerBlue, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  exit: { alignSelf: "center", paddingVertical: 10 },
});
