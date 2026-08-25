import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, View } from "react-native";

import { CurrentSession } from "@/api/session";
import { SessionActivityData } from "@/hooks/useTraineeHome";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import SessionNotification from "./SessionNotification";
import SessionTimeline from "./SessionTimeline";
import WaitingCard from "./WaitingCard";

type SessionBodyProps = {
  loading: boolean;
  session: CurrentSession | null;
  notAssigned: boolean;
  error: string | null;
  activities: SessionActivityData[];
  refreshing: boolean;
  loadSession: (mode?: "load" | "refresh") => void;
  onMarkAttendance: () => void;
  onEnterLiveQuiz: () => void;
  onEnterPostTest: () => void;
  onEnterSurvey: () => void;
};

export default function SessionBody({
  loading,
  session,
  notAssigned,
  error,
  activities,
  refreshing,
  loadSession,
  onMarkAttendance,
  onEnterLiveQuiz,
  onEnterPostTest,
  onEnterSurvey,
}: SessionBodyProps) {
  if (loading && !session) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.headerBlue} size="large" />
      </View>
    );
  }

  if (notAssigned) {
    return (
      <View style={styles.centered}>
        <WaitingCard title="No Session Assigned" subtitle="No session is assigned yet" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <AppText variant="body" color={Colors.gray600} align="center">
          {error}
        </AppText>
        <Pressable
          style={styles.retryButton}
          onPress={() => loadSession()}
          accessibilityRole="button"
          accessibilityLabel="Retry loading session"
        >
          <AppText variant="label" color={Colors.white}>
            Retry
          </AppText>
        </Pressable>
      </View>
    );
  }

  if (session && !session.started) {
    return (
      <View style={styles.centered}>
        <WaitingCard title="Session hasn't started yet" subtitle="Trainer will unlock soon as it's available" />
      </View>
    );
  }

  return (
    <SessionTimeline
      activities={activities}
      onMarkAttendance={onMarkAttendance}
      onEnterQuiz={onEnterLiveQuiz}
      onEnterPostTest={onEnterPostTest}
      onEnterSurvey={onEnterSurvey}
      footerComponent={<SessionNotification />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadSession("refresh")}
          colors={[Colors.headerBlue]}
          tintColor={Colors.headerBlue}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
