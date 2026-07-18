import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Clock from "@/assets/images/svg/clock.svg";
import Eye from "@/assets/images/svg/eye.svg";
import Refresh from "@/assets/images/svg/Refresh cw.svg";
import Wifi from "@/assets/images/svg/Wifi.svg";
import LiveQuizIcon from "@/assets/images/svg/live_quiz.svg";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";

export default function WaitScreen() {
  const router = useRouter();
  const progressPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const transition = setTimeout(() => router.replace("/quiz"), 2000);
    return () => clearTimeout(transition);
  },
    [router]);

  useEffect(() => {
    const progressAnimation = Animated.loop(
      Animated.timing(progressPosition, {
        toValue: 1,
        duration: 1150,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      })
    );

    progressAnimation.start();
    return () => progressAnimation.stop();
  },
    [progressPosition]);

  const progressTranslateX = progressPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-28, 28],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LiveHeader />
      <View style={styles.content}>
        <View style={styles.trainerIcon}><Ionicons name="people" size={Fonts.profileIconSize} color={Colors.primary} /></View>
        <AppText style={styles.title} weight={FontWeight.semiBold}>Waiting for</AppText>
        <AppText style={styles.title} color={Colors.primary} weight={FontWeight.semiBold}>Trainer...</AppText>
        <View style={styles.progress} accessibilityRole="progressbar" accessibilityLabel="Waiting for trainer">
          <Animated.View style={[styles.progressFill, { transform: [{ translateX: progressTranslateX }] }]} />
        </View>
        <AppText style={styles.message}>Look at the main screen.{"\n"}The quiz will begin shortly!</AppText>

        <View style={styles.infoCard}>
          <InfoItem icon={<Clock width={21} height={21} />} title="Stay Ready" text="The quiz will start automatically" color="#DDEEFF" />
          <InfoItem icon={<Eye width={21} height={21} />} title="Stay Focused" text="Keep your eyes on the main screen" color="#D8F8EB" />
          <InfoItem icon={<Ionicons name="notifications-outline" size={21} color="#DDAA00" />} title="Stay Connected" text="Do not refresh or leave the page" color="#FFF2C7" />
        </View>
        <Pressable style={styles.syncNotice}><View style={styles.syncIcon}><Refresh width={17} height={17} /></View><View style={styles.syncCopy}><AppText style={styles.syncTitle} weight={FontWeight.medium}>Sync Live Now</AppText><AppText style={styles.syncText}>Click to re-sync with the live session</AppText></View><Ionicons name="chevron-forward" size={18} color={Colors.primary} /></Pressable>
      </View>
    </SafeAreaView>
  );
}

function LiveHeader() {
  return <View style={styles.header}><View style={styles.liveName}><LiveQuizIcon width={13} height={13} /><AppText style={styles.liveTitle} color={Colors.white} weight={FontWeight.medium}>LIVE QUIZ</AppText></View><View style={styles.headerActions}><View style={styles.headerButton}><Refresh width={11} height={11} /><AppText style={styles.headerButtonText} color={Colors.primary}>REFRESH</AppText></View><View style={styles.connected}><Wifi width={11} height={11} /><AppText style={styles.connectedText} color={Colors.white}>CONNECTED</AppText></View></View></View>;
}

function InfoItem({ icon, title, text, color }: { icon: React.ReactNode; title: string; text: string; color: string }) {
  return <View style={styles.infoItem}><View style={[styles.infoIcon, { backgroundColor: color }]}>{icon}</View><AppText style={styles.infoTitle} weight={FontWeight.medium}>{title}</AppText><AppText style={styles.infoText}>{text}</AppText></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { height: 51, margin: 9, borderRadius: 10, backgroundColor: Colors.mainColour1, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  liveName: { flexDirection: "row", alignItems: "center", gap: 3 },
  liveTitle: { fontSize: Fonts.body },
  headerActions: { flexDirection: "row", gap: 4 },
  headerButton: { backgroundColor: Colors.white, borderRadius: 3, paddingHorizontal: 5, height: 17, flexDirection: "row", alignItems: "center", gap: 2 },
  headerButtonText: { fontSize: Fonts.overline },
  connected: { height: 17, borderRadius: 3, backgroundColor: Colors.success, paddingHorizontal: 5, flexDirection: "row", alignItems: "center", gap: 2 },
  connectedText: { fontSize: Fonts.overline },

  content: { flex: 1, alignItems: "center", paddingHorizontal: 16, paddingTop: 28 },
  trainerIcon: { width: 171, height: 171, borderRadius: 85, borderWidth: 2, borderColor: Colors.primary, alignItems: "center", justifyContent: "center", backgroundColor: Colors.white },
  title: { fontSize: Fonts.h1, lineHeight: 27, marginTop: 20 },
  progress: { width: 44, height: 3, borderRadius: 2, overflow: "hidden", backgroundColor: Colors.gray200, marginTop: 10 },
  progressFill: { width: 22, height: "100%", borderRadius: 2, backgroundColor: Colors.primary },
  message: { fontSize: Fonts.bodySm, textAlign: "center", lineHeight: 15, color: Colors.gray600, marginTop: 10 },

  infoCard: {
    width: "100%", marginTop: 22, backgroundColor: Colors.white, borderRadius: 10, padding: 12, flexDirection: "row", justifyContent: "space-between", shadowColor: Colors.black, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6, elevation: 2
  },
  infoItem: { width: "31%", alignItems: "center" },
  infoIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  infoTitle: { fontSize: Fonts.caption, marginTop: 7 },
  infoText: { fontSize: Fonts.overline, color: Colors.gray600, textAlign: "center", lineHeight: 10, marginTop: 5 },

  syncNotice: { width: "100%", marginTop: 15, padding: 10, backgroundColor: "#DDEEFF", borderRadius: 6, flexDirection: "row", alignItems: "center", gap: 8 },
  syncIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#CBE5FF", alignItems: "center", justifyContent: "center" },
  syncCopy: { flex: 1 },
  syncTitle: { fontSize: Fonts.caption },
  syncText: { fontSize: Fonts.overline, color: Colors.gray600, marginTop: 1 },

});
