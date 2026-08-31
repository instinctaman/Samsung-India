import { Fragment } from "react";

import LiveStudioCard from "@/components/session_dashboard/LiveStudioCard";
import ParticipantAttendanceCard from "@/components/session_dashboard/ParticipantAttendanceCard";

type LiveStudioSectionProps = {
  conferenceUid?: string;
  trainerName?: string;
  onLeaderboard: () => void;
  onRefresh: () => void;
};

export default function LiveStudioSection({
  conferenceUid,
  trainerName,
  onLeaderboard,
  onRefresh,
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

      <ParticipantAttendanceCard onRefresh={onRefresh} onCheck={() => {}} onReject={() => {}} />
    </Fragment>
  );
}
