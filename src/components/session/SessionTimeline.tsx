import { ReactElement } from "react";
import { RefreshControlProps, ScrollView, StyleSheet } from "react-native";

import TimelineItem, { SessionItem } from "./TimelineItem";

type Props = {
  sessions: SessionItem[];

  onMarkAttendance: () => void;
  onEnterQuiz: () => void;
  onEnterPostTest: () => void;
  onEnterSurvey: () => void;
  refreshControl?: ReactElement<RefreshControlProps>;
};

export default function SessionTimeline({
  sessions,
  onMarkAttendance,
  onEnterQuiz,
  onEnterPostTest,
  onEnterSurvey,
  refreshControl,
}: Props) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.timeline}
      refreshControl={refreshControl}
    >
      {sessions.map((session) => (
        <TimelineItem
          key={session.key}
          session={session}
          onMarkAttendance={onMarkAttendance}
          onEnterQuiz={onEnterQuiz}
          onEnterPostTest={onEnterPostTest}
          onEnterSurvey={onEnterSurvey}
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
