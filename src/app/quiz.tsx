import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Refresh from "@/assets/images/svg/Refresh cw.svg";
import Wifi from "@/assets/images/svg/Wifi.svg";
import LiveQuizIcon from "@/assets/images/svg/live_quiz.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

const options = [
  { id: "A", text: "Powerful 2nm Exynos 2600\nProcessor", color: Colors.success },
  { id: "B", text: "Larger 6.3-inch Dynamic\nDisplay", color: Colors.primary },
  { id: "C", text: "Bigger 4300mAh Battery", color: "#E5B800" },
  { id: "D", text: "None of these", color: "#FF3B30" },
];

export default function QuizScreen() {
  const [seconds, setSeconds] = useState(24);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (seconds === 0) return;
    const countdown = setInterval(() => setSeconds((value) => Math.max(value - 1, 0)), 1000);
    return () => clearInterval(countdown);
  }, [seconds]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.liveName}>
          <LiveQuizIcon width={13} height={13} />
          <AppText style={styles.liveTitle} color={Colors.white} weight={FontWeight.medium}>LIVE QUIZ</AppText>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} onPress={() => setSeconds(24)}>
            <Refresh width={11} height={11} />
            <AppText style={styles.headerButtonText} color={Colors.primary}>SYNC LIVE QUIZ</AppText>
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => setSeconds(24)}>
            <Refresh width={11} height={11} />
            <AppText style={styles.headerButtonText} color={Colors.primary}>REFRESH</AppText>
          </Pressable>
          <View style={styles.wifi}><Wifi width={13} height={13} /></View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.timer}><AppText style={styles.timerText} weight={FontWeight.medium}>{seconds}</AppText></View>
        <View style={styles.questionCard}>
          <AppText style={styles.questionNumber} color={Colors.primary}>Question 6 of 10</AppText>
          <AppText style={styles.question} weight={FontWeight.medium}>Identify the INCORRECT statement about{"\n"}performance with Galaxy S26.</AppText>
          <View style={styles.options}>
            {options.map((option) => <Pressable key={option.id} onPress={() => setSelected(option.id)} style={[styles.option, { borderColor: option.color }, selected === option.id && { backgroundColor: `${option.color}18` }]}><View style={[styles.optionLetter, { backgroundColor: option.color }]}><AppText style={styles.optionLetterText} color={Colors.white} weight={FontWeight.semiBold}>{option.id}</AppText></View><AppText style={styles.optionText}>{option.text}</AppText></Pressable>)}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { height: 51, margin: 9, borderRadius: 10, backgroundColor: Colors.mainColour1, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  liveName: { flexDirection: "row", alignItems: "center", gap: 3 }, liveTitle: { fontSize: Fonts.body }, headerActions: { flexDirection: "row", alignItems: "center", gap: 3 }, headerButton: { height: 17, borderRadius: 3, paddingHorizontal: 4, backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", gap: 2 }, headerButtonText: { fontSize: Fonts.overline }, wifi: { width: 20, height: 17, borderRadius: 3, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, paddingHorizontal: 14, paddingTop: 27 }, timer: { width: 81, height: 81, borderRadius: 41, borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.white, alignSelf: "center", alignItems: "center", justifyContent: "center" }, timerText: { fontSize: 36 }, questionCard: { marginTop: 31, borderRadius: 10, padding: 10, backgroundColor: Colors.white, shadowColor: Colors.black, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2 }, questionNumber: { alignSelf: "flex-start", fontSize: Fonts.overline, paddingHorizontal: 4, paddingVertical: 3, backgroundColor: "#DDEEFF", borderRadius: 3 }, question: { fontSize: Fonts.bodyLg, lineHeight: 18, marginTop: 9 }, options: { marginTop: 9, gap: 10 }, option: { minHeight: 48, borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", gap: 10 }, optionLetter: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" }, optionLetterText: { fontSize: Fonts.bodySm }, optionText: { fontSize: Fonts.caption, lineHeight: 13 },
});
