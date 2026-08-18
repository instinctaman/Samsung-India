import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QuizLiveHeader, QuizWaiting } from "@/components/quiz";
import { Colors } from "@/theme/colors";

export default function WaitScreen() {
  const router = useRouter();
  const { conferenceUid, suiteUid } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
  }>();

  const navigateToQuiz = () => {
    router.replace({
      pathname: "/quiz",
      params: {
        conferenceUid: conferenceUid ?? "demo-conf-uid-main",
        suiteUid: suiteUid ?? "suite-quiz-001",
      },
    });
  };

  useEffect(() => {
    const transition = setTimeout(navigateToQuiz, 2200);
    return () => clearTimeout(transition);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <QuizLiveHeader
        onSync={navigateToQuiz}
        onRefresh={navigateToQuiz}
        isConnected={true}
      />
      <QuizWaiting onSyncNow={navigateToQuiz} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
