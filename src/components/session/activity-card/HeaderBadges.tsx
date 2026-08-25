import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { SessionActivityData } from "@/hooks/useTraineeHome";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";
import SessionStatusBadge from "../SessionStatusBadge";
import { getStatusLabel } from "./getStatusLabel";

const RAN_DURATION_FALLBACK: Record<string, string> = {
  ATTENDANCE: "Ran : 45m 3s",
  LIVE_QUIZ: "Ran : 1h 55m",
  STANDARD_TEST: "Ran : 1h 50m",
};

type HeaderBadgesProps = {
  activity: SessionActivityData;
};

export default function HeaderBadges({ activity }: HeaderBadgesProps) {
  const { key, isLive, isCompleted, isMissed, isLocked } = activity;
  const isAttendance = key === "ATTENDANCE";
  const isQuiz = key === "LIVE_QUIZ";
  const isPostTest = key === "STANDARD_TEST";
  const runDurationFallback = RAN_DURATION_FALLBACK[key];

  return (
    <View style={styles.headerBadges}>
      {isCompleted && runDurationFallback && (
        <View style={styles.runtimePill}>
          <AppText variant="tiny" color={Colors.gray600} weight={FontWeight.medium}>
            {activity.ranDuration ?? runDurationFallback}
          </AppText>
        </View>
      )}

      <SessionStatusBadge
        label={getStatusLabel(activity)}
        live={isLive && !isLocked}
        liveColor={isAttendance ? Colors.recordedGreen : Colors.headerBlue}
        completed={isCompleted && isAttendance}
        scoreBadge={isCompleted && (isQuiz || isPostTest)}
        missed={isMissed}
        locked={isLocked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerBadges: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  runtimePill: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
});
