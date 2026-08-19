import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Bell from "@/assets/images/svg/bell.svg";
import Clock from "@/assets/images/svg/clock.svg";
import Eye from "@/assets/images/svg/eye.svg";
import Refresh from "@/assets/images/svg/Refresh cw.svg";
import { QuizLiveHeader } from "@/components/quiz";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";

export default function WaitScreen() {
  const router = useRouter();
  const { conferenceUid, suiteUid } = useLocalSearchParams<{
    conferenceUid: string;
    suiteUid: string;
  }>();

  const progressPosition = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    const progressAnimation = Animated.loop(
      Animated.timing(progressPosition, {
        toValue: 1,
        duration: 1150,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    );

    progressAnimation.start();
    return () => progressAnimation.stop();
  }, [progressPosition]);

  const progressTranslateX = progressPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-28, 28],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <QuizLiveHeader
        onSync={navigateToQuiz}
        onRefresh={navigateToQuiz}
        isConnected={true}
      />

      <View style={styles.content}>
        <View style={styles.trainerIcon}>
          <Ionicons
            name="people"
            size={Fonts.profileIconSize}
            color={Colors.headerBlue}
          />
        </View>

        <AppText style={styles.title} weight={FontWeight.semiBold}>
          Waiting for
        </AppText>
        <AppText
          style={styles.title}
          color={Colors.headerBlue}
          weight={FontWeight.semiBold}
        >
          Trainer...
        </AppText>

        <View
          style={styles.progress}
          accessibilityRole="progressbar"
          accessibilityLabel="Waiting for trainer"
        >
          <Animated.View
            style={[
              styles.progressFill,
              { transform: [{ translateX: progressTranslateX }] },
            ]}
          />
        </View>

        <AppText style={styles.message} weight={FontWeight.medium}>
          Look at the main screen.{"\n"}The quiz will begin shortly!
        </AppText>

        <View style={styles.infoCard}>
          <InfoItem
            icon={<Clock width={26} height={26} />}
            title="Stay Ready"
            text="The quiz will start automatically"
            color="#DDEEFF"
          />
          <InfoItem
            icon={<Eye width={26} height={26} />}
            title="Stay Focused"
            text="Keep your eyes on the main screen"
            color="#D8F8EB"
          />
          <InfoItem
            icon={<Bell width={26} height={26} />}
            title="Stay Connected"
            text="Do not refresh or leave the page"
            color="#FFF2C7"
          />
        </View>

        <Pressable
          style={styles.syncNotice}
          onPress={navigateToQuiz}
          accessibilityRole="button"
          accessibilityLabel="Sync Live Now"
        >
          <View style={styles.syncIcon}>
            <Refresh width={17} height={17} />
          </View>
          <View style={styles.syncCopy}>
            <AppText style={styles.syncTitle} weight={FontWeight.bold}>
              Sync Live Now
            </AppText>
            <AppText style={styles.syncText}>
              Click to re-sync with the live session
            </AppText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.headerBlue}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function InfoItem({
  icon,
  title,
  text,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <View style={styles.infoItem}>
      <View style={[styles.infoIcon, { backgroundColor: color }]}>{icon}</View>
      <AppText style={styles.infoTitle} weight={FontWeight.medium}>
        {title}
      </AppText>
      <AppText style={styles.infoText} weight={FontWeight.medium}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  trainerIcon: {
    width: 172,
    height: 172,
    borderRadius: 86,
    borderWidth: 2.5,
    borderColor: Colors.headerBlue,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 31,
    lineHeight: 36,
    marginTop: 20,
  },
  progress: {
    width: 44,
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: Colors.gray200,
    marginTop: 10,
  },
  progressFill: {
    width: 22,
    height: "100%",
    borderRadius: 2,
    backgroundColor: Colors.headerBlue,
  },
  message: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    color: Colors.gray600,
    marginTop: 10,
  },
  infoCard: {
    width: "100%",
    marginTop: 22,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  infoItem: {
    width: "31%",
    alignItems: "center",
  },
  infoIcon: {
    width: 49,
    height: 49,
    borderRadius: 24.5,
    alignItems: "center",
    justifyContent: "center",
  },

  infoTitle: {
    fontSize: 12,
    marginTop: 7,
  },
  infoText: {
    fontSize: 8.5,
    color: Colors.gray600,
    textAlign: "center",
    lineHeight: 12,
    marginTop: 5,
  },
  syncNotice: {
    width: "100%",
    marginTop: 15,
    padding: 12,
    backgroundColor: "#DDEEFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  syncIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#CBE5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  syncCopy: {
    flex: 1,
  },
  syncTitle: {
    fontSize: 13,
    color: Colors.black,
  },
  syncText: {
    fontSize: 11,
    color: Colors.gray600,
    marginTop: 1,
  },
});

