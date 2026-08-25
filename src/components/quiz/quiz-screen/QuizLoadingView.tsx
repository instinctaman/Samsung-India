import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontSize } from "@/theme/typography";

export default function QuizLoadingView() {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator color={Colors.headerBlue} size="large" />
      <AppText style={styles.loadingText}>Loading the quiz…</AppText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: FontSize.label,
    color: Colors.gray600,
    textAlign: "center",
  },
});
