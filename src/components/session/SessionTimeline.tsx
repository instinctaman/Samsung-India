import type { ComponentType }  from "react";
import { ScrollView, StyleSheet } from "react-native";

import TimelineItem from "./TimelineItem";
import { Fonts } from "@/theme/fonts";

import type { SvgProps } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

type SessionItem = {
  time: string;
  endTime: string;
  type: string;
  duration: string;
  status: "LIVE NOW" | "Upcoming";
  icon: keyof typeof Ionicons.glyphMap | ComponentType<SvgProps>;
  iconColor: string;
};

type Props = {
  sessions: SessionItem[];

  attendanceRecorded: boolean;
  quizCompleted: boolean;

  onMarkAttendance: () => void;
  onEnterQuiz: () => void;
  onEnterPostTest: () => void;
};

export default function SessionTimeline({
  sessions,
  attendanceRecorded,
  quizCompleted,
  onMarkAttendance,
  onEnterQuiz,
  onEnterPostTest,
}: Props) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.timeline}
    >
      {sessions.map((session, index) => (
        <TimelineItem
          key={`${session.time}-${session.type}`}
          session={session}
          isAttendanceLive={!attendanceRecorded && index === 0}
          isAttendanceRecorded={attendanceRecorded && index === 0}
          isQuizLive={attendanceRecorded && index === 1 && !quizCompleted}
          isQuizCompleted={quizCompleted && index === 1}
          isPostTestLive={quizCompleted && index === 2}
          onMarkAttendance={onMarkAttendance}
          onEnterQuiz={onEnterQuiz}
          onEnterPostTest={onEnterPostTest}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  timeline: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 18,
    gap: 10,
  },
});