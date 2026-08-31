import { Fragment } from "react";

import LiveStudioCard from "@/components/session_dashboard/LiveStudioCard";
import ParticipantAttendanceCard from "@/components/session_dashboard/ParticipantAttendanceCard";
import { ParticipantItem } from "@/components/session_dashboard/sessionDashboardTypes";

type LiveStudioSectionProps = {
  conferenceUid?: string;
  trainerName?: string | null;
  participants: ParticipantItem[];
  onLeaderboard: () => void;
  onRefresh: () => void;
  onMarkAttendance: (traineeUid: string, status: "Present" | "Absent") => void;
};

export default function LiveStudioSection({
  conferenceUid,
  trainerName,
  participants,
  onLeaderboard,
  onRefresh,
  onMarkAttendance,
}: LiveStudioSectionProps) {
  return (
    <Fragment>
      <LiveStudioCard
        conferenceUid={conferenceUid}
        trainerName={trainerName}
        onLaunchNext={() => {}}
        onStopTimer={() => {}}
        onLeaderboard={onLeaderboard}
        onLobby={() => {}}
      />

      <ParticipantAttendanceCard
        participants={participants}
        onRefresh={onRefresh}
        onCheck={(id) => onMarkAttendance(id, "Present")}
        onReject={(id) => onMarkAttendance(id, "Absent")}
      />
    </Fragment>
  );
}
