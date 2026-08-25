import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";

type QuizNavBarProps = {
  questionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
};

export default function QuizNavBar({ questionIndex, totalQuestions, onPrevious, onNext }: QuizNavBarProps) {
  const isFirst = questionIndex === 0;

  return (
    <View style={styles.navBar}>
      <Pressable
        style={[styles.prevBtn, isFirst && styles.prevBtnDisabled]}
        onPress={onPrevious}
        disabled={isFirst}
        accessibilityRole="button"
        accessibilityLabel="Previous question"
      >
        <Ionicons name="arrow-back" size={15} color={isFirst ? Colors.gray400 : Colors.headerBlue} />
        <AppText style={[styles.prevBtnText, isFirst && styles.prevBtnTextDisabled]} weight={FontWeight.bold}>
          Previous
        </AppText>
      </Pressable>

      <View style={styles.dotRow}>
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <View key={i} style={[styles.dot, i === questionIndex && styles.dotActive]} />
        ))}
      </View>

      <Pressable style={styles.nextBtn} onPress={onNext} accessibilityRole="button" accessibilityLabel="Next question">
        <AppText style={styles.nextBtnText} weight={FontWeight.bold}>
          Next
        </AppText>
        <Ionicons name="arrow-forward" size={15} color={Colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  prevBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.headerBlue,
    backgroundColor: Colors.white,
  },
  prevBtnDisabled: {
    borderColor: Colors.gray200,
    backgroundColor: Colors.gray100,
  },
  prevBtnText: {
    fontSize: 13,
    color: Colors.headerBlue,
  },
  prevBtnTextDisabled: {
    color: Colors.gray400,
  },
  dotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.gray200,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.headerBlue,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: Colors.headerBlue,
  },
  nextBtnText: {
    fontSize: 13,
    color: Colors.white,
  },
});
