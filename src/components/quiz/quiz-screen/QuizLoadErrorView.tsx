import { Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontSize, FontWeight } from "@/theme/typography";

type QuizLoadErrorViewProps = {
  error: string | null;
  onRetry: () => void;
};

export default function QuizLoadErrorView({ error, onRetry }: QuizLoadErrorViewProps) {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <AppText style={styles.loadingText}>{error}</AppText>
      <Pressable style={styles.retryButton} onPress={onRetry}>
        <AppText color={Colors.white} weight={FontWeight.bold}>
          Try Again
        </AppText>
      </Pressable>
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
  retryButton: {
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
