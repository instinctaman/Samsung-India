import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";

export type QuestionGridItemStatus = "attempted" | "skipped" | "expired";

export type QuestionStatusGridProps = {
  totalQuestions: number;
  answers: Record<number, string | null>;
  currentIndex?: number;
  onSelectQuestion: (index: number) => void;
};

export default function QuestionStatusGrid({
  totalQuestions,
  answers,
  currentIndex,
  onSelectQuestion,
}: QuestionStatusGridProps) {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: totalQuestions }, (_, index) => {
        const hasAnswered = Object.prototype.hasOwnProperty.call(
          answers,
          index
        );
        const answer = answers[index];

        let status: QuestionGridItemStatus = "skipped";
        if (hasAnswered) {
          if (answer === null) {
            status = "expired";
          } else {
            status = "attempted";
          }
        }

        const isCurrent = currentIndex === index;

        const tileStyle =
          status === "attempted"
            ? styles.attemptedTile
            : status === "expired"
              ? styles.expiredTile
              : styles.skippedTile;

        const textStyle =
          status === "attempted"
            ? styles.attemptedText
            : status === "expired"
              ? styles.expiredText
              : styles.skippedText;

        return (
          <Pressable
            key={index}
            onPress={() => onSelectQuestion(index)}
            style={({ pressed }) => [
              styles.tile,
              tileStyle,
              isCurrent && styles.currentTile,
              pressed && styles.pressedTile,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Question ${index + 1}: ${status}`}
          >
            <AppText style={[styles.tileText, textStyle]} weight={FontWeight.bold}>
              {index + 1}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    marginTop: 14,
  },
  tile: {
    width: 54,
    height: 54,
    borderRadius: 10,
    borderWidth: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedTile: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
  currentTile: {
    borderWidth: 2.2,
    borderColor: Colors.headerBlue,
  },
  attemptedTile: {
    backgroundColor: "#E8F8EF",
    borderColor: "#81D1AD",
  },
  skippedTile: {
    backgroundColor: "#FEF9C3",
    borderColor: "#FDE047",
  },
  expiredTile: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },
  tileText: {
    fontSize: 19,
  },
  attemptedText: {
    color: "#00A859",
  },
  skippedText: {
    color: "#D97706",
  },
  expiredText: {
    color: "#EF4444",
  },
});
