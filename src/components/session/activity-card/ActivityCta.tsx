import { SessionActivityData } from "@/hooks/useTraineeHome";
import { Colors } from "@/theme/colors";
import RecordedCard from "../RecordedCard";
import SessionButton from "../SessionButton";
import WaitingCard from "../WaitingCard";
import LockedViolationCard from "./LockedViolationCard";
import MissedBanner from "./MissedBanner";

type ActivityCtaProps = {
  activity: SessionActivityData;
  isAttendance: boolean;
  onMarkAttendance: () => void;
  onEnterAction: () => void;
};

export default function ActivityCta({ activity, isAttendance, onMarkAttendance, onEnterAction }: ActivityCtaProps) {
  const { isCompleted, isLive, isMissed, isLocked, securityCheckInCompleted } = activity;

  if (isCompleted) {
    return (
      <RecordedCard
        title={isAttendance ? "Recorded" : "Completed"}
        subtitle="Good Job !"
        color={Colors.recordedGreen}
        backgroundColor={Colors.recordedGreenBg}
      />
    );
  }

  if (isLive && isAttendance) {
    return (
      <SessionButton
        title={securityCheckInCompleted ? "Mark Attendance" : "Secure Check-In"}
        icon={securityCheckInCompleted ? undefined : "camera"}
        onPress={onMarkAttendance}
        backgroundColor={Colors.recordedGreen}
      />
    );
  }

  if (isLive) {
    return <SessionButton title="Enter Session" onPress={onEnterAction} backgroundColor={Colors.headerBlue} />;
  }

  if (isMissed) return <MissedBanner />;
  if (isLocked) return <LockedViolationCard />;

  return <WaitingCard title="Please Wait" subtitle="Trainer will unlock soon..." />;
}
