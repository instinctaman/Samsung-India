import { StyleSheet, View } from "react-native";

import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import AppText from "@/components/ui/AppText";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { QUESTION_TYPE_LABELS, QUESTION_TYPE_OPTIONS } from "./constants";

type QuestionMetaFieldsProps = {
  questionType: string;
  setQuestionType: (value: string) => void;
  points: string;
  setPoints: (value: string) => void;
  timerSeconds: string;
  setTimerSeconds: (value: string) => void;
};

export default function QuestionMetaFields({
  questionType,
  setQuestionType,
  points,
  setPoints,
  timerSeconds,
  setTimerSeconds,
}: QuestionMetaFieldsProps) {
  return (
    <View style={styles.sheetRow}>
      <View style={styles.sheetHalf}>
        <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
          Type
        </AppText>
        <AppSelect
          selectedValue={questionType}
          onValueChange={setQuestionType}
          items={QUESTION_TYPE_OPTIONS.map((t) => ({
            label: QUESTION_TYPE_LABELS[t] ?? t,
            value: t,
          }))}
        />
      </View>
      <View style={styles.sheetQuarter}>
        <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
          Pts
        </AppText>
        <AppInput placeholder="1" keyboardType="number-pad" value={points} onChangeText={setPoints} />
      </View>
      <View style={styles.sheetQuarter}>
        <AppText style={styles.fieldLabel} weight={FontWeight.medium}>
          Sec
        </AppText>
        <AppInput
          placeholder="30"
          keyboardType="number-pad"
          value={timerSeconds}
          onChangeText={setTimerSeconds}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetRow: { flexDirection: "row", gap: 8 },
  sheetHalf: { flex: 2 },
  sheetQuarter: { flex: 1 },
  fieldLabel: { fontSize: Fonts.caption, marginBottom: 4 },
});
