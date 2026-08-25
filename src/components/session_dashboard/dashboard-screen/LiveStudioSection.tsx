import { Fragment } from "react";

import LiveStudioCard from "@/components/session_dashboard/LiveStudioCard";
import ParticipantAttendanceCard from "@/components/session_dashboard/ParticipantAttendanceCard";

type LiveStudioSectionProps = {
  onLeaderboard: () => void;
  onRefresh: () => void;
};

export default function LiveStudioSection({ onLeaderboard, onRefresh }: LiveStudioSectionProps) {
  return (
    <Fragment>
      <LiveStudioCard onLaunchNext={() => {}} onStopTimer={() => {}} onLeaderboard={onLeaderboard} onLobby={() => {}} />

      <ParticipantAttendanceCard onRefresh={onRefresh} onCheck={() => {}} onReject={() => {}} />
    </Fragment>
  );
}
