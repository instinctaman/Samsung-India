import { Fragment } from "react";

import { LiveStudio } from "@/api/training";
import LiveStudioCard from "@/components/session_dashboard/LiveStudioCard";
import ParticipantAttendanceCard from "@/components/session_dashboard/ParticipantAttendanceCard";
import { LiveQuizControls, ParticipantItem } from "@/components/session_dashboard/sessionDashboardTypes";

type LiveStudioSectionProps = {
  participants: ParticipantItem[];
  liveStudio: LiveStudio | null;
  liveQuizControls: LiveQuizControls;
  onRefresh: () => void;
  onMarkAttendance: (traineeUid: string, status: "Present" | "Absent") => void;
};

export default function LiveStudioSection({
  participants,
  liveStudio,
  liveQuizControls,
  onRefresh,
  onMarkAttendance,
}: LiveStudioSectionProps) {
  return (
    <Fragment>
      {liveStudio && <LiveStudioCard liveStudio={liveStudio} controls={liveQuizControls} />}

      <ParticipantAttendanceCard
        participants={participants}
        onRefresh={onRefresh}
        onCheck={(id) => onMarkAttendance(id, "Present")}
        onReject={(id) => onMarkAttendance(id, "Absent")}
      />
    </Fragment>
  );
}
