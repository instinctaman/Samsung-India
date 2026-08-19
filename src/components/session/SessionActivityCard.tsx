import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import AppText from "@/components/ui/AppText";
import { SessionActivityData } from "@/hooks/useTraineeHome";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
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
  const { key, isLive, isCompleted, isMissed } = activity;
  const isAttendance = key === "ATTENDANCE";
  const isQuiz = key === "LIVE_QUIZ";

  const statusLabel = isCompleted
    ? isAttendance
      ? "Present"
      : isQuiz
        ? `Score : ${activity.score ?? "9/15"}`
        : activity.score
          ? `Score: ${activity.score}`
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
            style={[
              styles.typeLabel,
              {
                color: isAttendance ? Colors.recordedGreen : Colors.headerBlue,
              },
            ]}
            weight={FontWeight.bold}
          >
            {activity.type}
          </AppText>
        </View>

        <View style={styles.headerBadges}>
          {isAttendance && isCompleted && (
            <View style={styles.runtimePill}>
              <AppText style={styles.runtimeText} weight={FontWeight.medium}>
                {activity.ranDuration ?? "Ran : 45m 3s"}
              </AppText>
            </View>
          )}

          {isQuiz && isCompleted && (
            <View style={styles.runtimePill}>
              <AppText style={styles.runtimeText} weight={FontWeight.medium}>
                {activity.ranDuration ?? "Ran : 1h 55m"}
              </AppText>
            </View>
          )}

          <SessionStatusBadge
            label={statusLabel}
            live={isLive}
            completed={isCompleted && !isQuiz}
            scoreBadge={isCompleted && isQuiz}
            missed={isMissed}
          />
        </View>
      </View>

      {/* Card Title */}
      <AppText style={styles.activityTitle} weight={FontWeight.bold}>
        {activity.title}
      </AppText>

      {/* Meta Row: Duration + Present / Completed Sub-status */}
      <View style={styles.metaRow}>
        <View style={styles.durationPill}>
          <AppText style={styles.durationText} weight={FontWeight.bold}>
            {activity.duration}
          </AppText>
        </View>

        {isCompleted && isAttendance && (
          <View style={styles.presenceInfo}>
            <View style={styles.presenceDot} />
            <AppText style={styles.presenceText} weight={FontWeight.semiBold}>
              {activity.completedAt
                ? `Present (${activity.completedAt})`
                : "Present (10:25)"}
            </AppText>
          </View>
        )}

        {isCompleted && isQuiz && (
          <View style={styles.completedQuizInfo}>
            <Ionicons name="trophy" size={14} color="#F59E0B" />
            <AppText
              style={styles.completedQuizText}
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
      ) : isCompleted && isQuiz ? (
        <RecordedCard
          title="Completed"
          subtitle="Good Job !"
          color={Colors.headerBlue}
          backgroundColor="#DDEEFF"
        />
      ) : isCompleted ? (
        <RecordedCard
          title="Recorded"
          subtitle="Good Job !"
          color={Colors.headerBlue}
          backgroundColor={Colors.waitingBlueBg}
        />
      ) : isLive && isAttendance ? (
        <SessionButton
          title={activity.geoFencing ? "Secure Check-In" : "Mark Attendance"}
          icon={activity.geoFencing ? "camera" : undefined}
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
      ) : key === "STANDARD_TEST" ? (
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
      <Ionicons name="close-circle" size={20} color={Colors.danger} />
      <View style={styles.missedTextColumn}>
        <AppText
          style={styles.missedTitle}
          color={Colors.danger}
          weight={FontWeight.bold}
        >
          Missed
        </AppText>
        <AppText style={styles.missedSubtitle} color={Colors.danger}>
          You missed this session, try next time.
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
  typeLabel: {
    fontSize: 11,
    letterSpacing: 0.2,
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
  runtimeText: {
    fontSize: 8,
    color: Colors.gray600,
  },
  activityTitle: {
    marginTop: 8,
    fontSize: 16,
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
  durationText: {
    fontSize: 11,
    color: "#374151",
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
  presenceText: {
    fontSize: 9.5,
    color: Colors.recordedGreen,
  },

  completedQuizInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  completedQuizText: {
    fontSize: 12.5,
    color: Colors.headerBlue,
  },
  missedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 10,
  },
  missedTextColumn: {
    gap: 1,
  },
  missedTitle: {
    fontSize: 13,
  },
  missedSubtitle: {
    fontSize: 11,
  },
});
