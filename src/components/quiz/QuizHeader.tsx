import { Pressable, StyleSheet, View } from "react-native";

import Refresh from "@/assets/images/svg/Refresh cw.svg";
import Wifi from "@/assets/images/svg/Wifi.svg";
import LiveQuizIcon from "@/assets/images/svg/live_quiz.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

export default function QuizHeader({ onReset }: { onReset: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.liveName}>
        <LiveQuizIcon width={13} height={13} />
        <AppText style={styles.liveTitle} color={Colors.white} weight={FontWeight.medium}>LIVE QUIZ</AppText>
      </View>
      <View style={styles.headerActions}>
        <Pressable style={styles.headerButton} onPress={onReset}>
          <Refresh width={11} height={11} />
          <AppText style={styles.headerButtonText} color={Colors.primary}>SYNC LIVE QUIZ</AppText>
        </Pressable>
        <Pressable style={styles.headerButton} onPress={onReset}>
          <Refresh width={11} height={11} />
          <AppText style={styles.headerButtonText} color={Colors.primary}>REFRESH</AppText>
        </Pressable>
        <View style={styles.wifi}>
          <Wifi width={13} height={13} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 51, margin: 9, borderRadius: 10, backgroundColor: Colors.mainColour1, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  liveName: { flexDirection: "row", alignItems: "center", gap: 3 },
  liveTitle: { fontSize: Fonts.body },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 3 },
  headerButton: { height: 17, borderRadius: 3, paddingHorizontal: 4, backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", gap: 2 },
  headerButtonText: { fontSize: Fonts.overline },
  wifi: { width: 20, height: 17, borderRadius: 3, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center" },
});
