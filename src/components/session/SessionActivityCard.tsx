import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { SessionActivityData } from "@/hooks/useTraineeHome";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/typography";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import RecordedCard from "./RecordedCard";
import SessionButton from "./SessionButton";
import SessionStatusBadge from "./SessionStatusBadge";
import WaitingCard from "./WaitingCard";

export type SessionActivityCardProps = {
  activity: SessionActivityData;
  onMarkAttendance: () => void;
  onEnterQuiz: () => void;
  onEnterPostTest: () => void;
  onEnterSurvey: () => void;
};

export default function SessionActivityCard({
  activity,
  onMarkAttendance,
  onEnterQuiz,
  onEnterPostTest,
  onEnterSurvey,
}: SessionActivityCardProps) {
  const { key, isLive, isCompleted, isMissed, isLocked } = activity;
  const isAttendance = key === "ATTENDANCE";
  const isQuiz = key === "LIVE_QUIZ";
  const isPostTest = key === "STANDARD_TEST";

  const statusLabel = isLocked
    ? "Locked"
    : isCompleted
      ? isAttendance
        ? "Recorded"
        : isQuiz
          ? `Score : ${activity.score ?? "9/15"}`
          : isPostTest
            ? `Score : ${activity.score ?? "12/15"}`
            : "Completed"
      : isMissed
        ? "Missed"
        : isLive
          ? "LIVE NOW"
          : "Upcoming";

  const handleEnterAction = () => {
    if (key === "LIVE_QUIZ") {
      onEnterQuiz();
    } else if (key === "SURVEY") {
      onEnterSurvey();
    } else if (key === "STANDARD_TEST") {
      onEnterPostTest();
    } else if (isAttendance) {
      onMarkAttendance();
    }
  };

  const renderTypeIcon = () => {
    if (isAttendance) {
      return (
        <View style={[styles.typeIconWrap, { backgroundColor: "#D4F4E4" }]}>
          <Ionicons name="person" size={13} color={Colors.recordedGreen} />
        </View>
      );
    }
    if (isQuiz) {
      return (
        <View style={[styles.typeIconWrap, { backgroundColor: "#DDEEFF" }]}>
          <Ionicons name="alarm" size={13} color={Colors.headerBlue} />
        </View>
      );
    }
    return (
      <View style={[styles.typeIconWrap, { backgroundColor: "#DDEEFF" }]}>
        <Ionicons name="document-text" size={13} color={Colors.headerBlue} />
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      {/* Card Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.typeSection}>
          {renderTypeIcon()}
          <AppText
            variant="overline"
            color={isAttendance ? Colors.recordedGreen : Colors.headerBlue}
            weight={FontWeight.bold}
          >
            {activity.type}
          </AppText>
        </View>

        <View style={styles.headerBadges}>
          {isAttendance && isCompleted && (
            <View style={styles.runtimePill}>
              <AppText variant="tiny" color={Colors.gray600} weight={FontWeight.medium}>
                {activity.ranDuration ?? "Ran : 45m 3s"}
              </AppText>
            </View>
          )}

          {isQuiz && isCompleted && (
            <View style={styles.runtimePill}>
              <AppText variant="tiny" color={Colors.gray600} weight={FontWeight.medium}>
                {activity.ranDuration ?? "Ran : 1h 55m"}
              </AppText>
            </View>
          )}

          {isPostTest && isCompleted && (
            <View style={styles.runtimePill}>
              <AppText variant="tiny" color={Colors.gray600} weight={FontWeight.medium}>
                {activity.ranDuration ?? "Ran : 1h 50m"}
              </AppText>
            </View>
          )}

          <SessionStatusBadge
            label={statusLabel}
            live={isLive && !isLocked}
            liveColor={isAttendance ? Colors.recordedGreen : Colors.headerBlue}
            completed={isCompleted && isAttendance}
            scoreBadge={isCompleted && (isQuiz || isPostTest)}
            missed={isMissed}
            locked={isLocked}
          />
        </View>
      </View>

      {/* Card Title */}
      <AppText variant="body" weight={FontWeight.bold} style={styles.activityTitle}>
        {activity.title}
      </AppText>

      {/* Meta Row: Duration + Present / Completed Sub-status */}
      <View style={styles.metaRow}>
        <View style={styles.durationPill}>
          <AppText variant="overline" weight={FontWeight.bold} color="#374151">
            {activity.duration}
          </AppText>
        </View>

        {isCompleted && isAttendance && (
          <View style={styles.presenceInfo}>
            <View style={styles.presenceDot} />
            <AppText variant="tiny" weight={FontWeight.semiBold} color={Colors.recordedGreen}>
              {activity.completedAt
                ? `Present (${activity.completedAt})`
                : "Present (10:25)"}
            </AppText>
          </View>
        )}

        {isCompleted && (isQuiz || isPostTest) && (
          <View style={styles.completedQuizInfo}>
            <Ionicons name="trophy" size={14} color="#F59E0B" />
            <AppText
              variant="caption"
              color={Colors.headerBlue}
              weight={FontWeight.semiBold}
            >
              {activity.completedAt ?? "Completed successfully"}
            </AppText>
          </View>
        )}
      </View>

      {/* Card State / CTA section */}
      {isCompleted && isAttendance ? (
        <RecordedCard
          title="Recorded"
          subtitle="Good Job !"
          color={Colors.recordedGreen}
          backgroundColor={Colors.recordedGreenBg}
        />
      ) : isCompleted && (isQuiz || isPostTest) ? (
        <RecordedCard
          title="Completed"
          subtitle="Good Job !"
          color={Colors.recordedGreen}
          backgroundColor={Colors.recordedGreenBg}
        />
      ) : isCompleted ? (
        <RecordedCard
          title="Completed"
          subtitle="Good Job !"
          color={Colors.recordedGreen}
          backgroundColor={Colors.recordedGreenBg}
        />
      ) : isLive && isAttendance ? (
        <SessionButton
          title={
            activity.securityCheckInCompleted
              ? "Mark Attendance"
              : "Secure Check-In"
          }
          icon={activity.securityCheckInCompleted ? undefined : "camera"}
          onPress={onMarkAttendance}
          backgroundColor={Colors.recordedGreen}
        />
      ) : isLive && !isCompleted ? (
        <SessionButton
          title="Enter Session"
          onPress={handleEnterAction}
          backgroundColor={Colors.headerBlue}
        />
      ) : isMissed ? (
        <MissedBanner />
      ) : isLocked ? (
        <LockedViolationCard />
      ) : !isCompleted ? (
        <WaitingCard
          title="Please Wait"
          subtitle="Trainer will unlock soon..."
        />
      ) : null}

    </View>
  );
}

function MissedBanner() {
  return (
    <View style={styles.missedBanner}>
      <View style={styles.missedIconWrap}>
        <Ionicons name="close-circle" size={18} color={Colors.danger} />
      </View>
      <View style={styles.missedTextColumn}>
        <AppText
          variant="caption"
          color={Colors.danger}
          weight={FontWeight.bold}
        >
          Missed
        </AppText>
        <AppText variant="overline" color={Colors.danger}>
          You missed this session, try next time.
        </AppText>
      </View>
    </View>
  );
}

function LockedViolationCard() {
  return (
    <View style={styles.lockedBanner}>
      <View style={styles.lockedIconWrap}>
        <Ionicons name="lock-closed" size={16} color="#EF4444" />
      </View>
      <View style={styles.lockedTextColumn}>
        <AppText
          variant="caption"
          color="#EF4444"
          weight={FontWeight.bold}
        >
          Security Violation
        </AppText>
        <AppText variant="overline" color="#B91C1C">
          Test was locked due to proctoring violation.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: Radius.card,
    ...Shadows.timelineCard,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
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
  activityTitle: {
    marginTop: 8,
    color: Colors.black,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  durationPill: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  presenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  presenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.recordedGreen,
  },

  completedQuizInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  missedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    width: "100%",
  },
  missedIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FCD8D8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  missedTextColumn: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
  },
  lockedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    width: "100%",
  },
  lockedIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FCD8D8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  lockedTextColumn: {
    flex: 1,
    flexShrink: 1,
    gap: 2,
  },
});
