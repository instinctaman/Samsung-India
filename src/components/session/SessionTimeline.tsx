import { ScrollView, StyleSheet } from "react-native";

import TimelineItem, { SessionItem } from "./TimelineItem";

type Props = {
  sessions: SessionItem[];

  onMarkAttendance: () => void;
  onEnterQuiz: () => void;
  onEnterPostTest: () => void;
};

export default function SessionTimeline({
  sessions,
  onMarkAttendance,
  onEnterQuiz,
  onEnterPostTest,
}: Props) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.timeline}
    >
      {sessions.map((session) => (
        <TimelineItem
          key={session.key}
          session={session}
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
