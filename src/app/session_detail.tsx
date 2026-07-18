import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";
import { StatusBar } from "expo-status-bar";

import AccountCircle from "@/assets/images/svg/account_circle.svg";
import Alarm from "@/assets/images/svg/alarm.svg";
import Calendar from "@/assets/images/svg/calender.svg";
import GoogleDocs from "@/assets/images/svg/google-docs 1.svg";
import Loading from "@/assets/images/svg/loading.svg";
import AppText from "@/components/ui/AppText";
import AppFooter from "@/components/ui/AppFooter";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { Fonts } from "@/theme/fonts";
import SessionHeader from "@/components/session/SessionHeader";
import SessionTypeIcon from "@/components/session/SessionTypeIcon";
import SessionStatusBadge from "@/components/session/SessionStatusBadge";
import SessionButton from "@/components/session/SessionButton";
import WaitingCard from "@/components/session/WaitingCard";
import RecordedCard from "@/components/session/RecordedCard";
import TimelineItem from "@/components/session/TimelineItem";
import SessionTimeline from "@/components/session/SessionTimeline";
import SessionNotice from "@/components/session/SessionNotice";

type SessionItem = {
  time: string;
  endTime: string;
  type: string;
  duration: string;
  status: "LIVE NOW" | "Upcoming";
  icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
  iconColor: string;
};

const sessions: SessionItem[] = [
  { time: "09:00", endTime: "10:00", type: "ATTENDANCE", duration: "1h", status: "LIVE NOW", icon: AccountCircle, iconColor: Colors.success, },
  { time: "10:00", endTime: "12:00", type: "QUIZ", duration: "2h", status: "Upcoming", icon: Alarm, iconColor: Colors.mainColour1, },
  { time: "12:00", endTime: "14:00", type: "POST TEST", duration: "2h", status: "Upcoming", icon: GoogleDocs , iconColor: Colors.mainColour1, },
  { time: "14:00", endTime: "16:00", type: "POST TEST", duration: "2h", status: "Upcoming", icon: GoogleDocs , iconColor: Colors.mainColour1, },
];

export default function SessionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { attendance, quiz } = useLocalSearchParams<{ attendance?: string; quiz?: string }>();
  const attendanceRecorded = attendance === "recorded";
  const quizCompleted = quiz === "completed";

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={[styles.statusBarBackground, { height: insets.top }]} />
        <StatusBar style="light" animated />
        <SessionHeader
          onBack={() => router.back()}
          onLogout={() => console.log("Logout")}
          userName="Anshu Pandey"
          confirmationStatus="Not Confirmed"
          sessionType="One-Day Session"
          title="Training Session"
          date="06 Jun 2026"
          location="New Delhi"
        />

        <View style={styles.body}>
          <SessionTimeline
            sessions={sessions}
            attendanceRecorded={attendanceRecorded}
            quizCompleted={quizCompleted}
            onMarkAttendance={() => router.push("/attendance")}
            onEnterQuiz={() => router.push("/wait")}
            onEnterPostTest={() => router.push("/post_test")}
          />
          <SessionNotice />
        </View>
        <AppFooter activeTab="plan" />
      </SafeAreaView >
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statusBarBackground: { position: "absolute", left: 0, right: 0, backgroundColor: Colors.mainColour1 },
  body: {
    flex: 1,
    minHeight: 0,
    backgroundColor: Colors.background,
  },
});
