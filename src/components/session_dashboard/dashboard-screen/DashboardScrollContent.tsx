import { RefreshControl, ScrollView, StyleSheet } from "react-native";

import { SessionDashboard } from "@/api/training";
import {
  AssessmentResultCard,
  AudienceBreakdownCard,
  ExecutionFlowCard,
  SessionDetailsCard,
  SessionHeroesCard,
  TopPerformersCard,
} from "@/components/session_dashboard";
import { useLiveRuntime } from "@/hooks/useLiveRuntime";
import { Colors } from "@/theme/colors";
import { formatDurationHMS, formatRuntimeLabel } from "./formatting";
import LiveStudioSection from "./LiveStudioSection";
import { participantsFromTrainees } from "./participantMapper";
import RuntimeAndQuizSection from "./RuntimeAndQuizSection";

type DashboardScrollContentProps = {
  conferenceUid?: string;
  data: SessionDashboard | null;
  isSessionClosed: boolean;
  showSessionData: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onAdvanceModule: () => void;
  onMarkAttendance: (traineeUid: string, status: "Present" | "Absent") => void;
  onEndSession: () => void;
  onLeaderboard: () => void;
};

export default function DashboardScrollContent({
  conferenceUid,
  data,
  isSessionClosed,
  showSessionData,
  refreshing,
  onRefresh,
  onAdvanceModule,
  onMarkAttendance,
  onEndSession,
  onLeaderboard,
}: DashboardScrollContentProps) {
  const runtimeSeconds = useLiveRuntime(data?.actualStartedAt, data?.actualEndedAt);
  const participants = participantsFromTrainees(data?.trainees ?? []);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.mainColour1]} tintColor={Colors.mainColour1} />
      }
    >
      <SessionDetailsCard
        topic={data?.trainingType || "Webinar"}
        date={data?.conferenceDate || "20 Jul 2026"}
        trainerName={data?.trainerName || "Demo Trainer"}
        runtime={formatRuntimeLabel(runtimeSeconds)}
        conferenceStatus={data?.conferenceStatus || "Scheduled"}
      />

      <AudienceBreakdownCard
        totalAudience={data?.audience?.total ?? 22}
        present={data?.audience?.present ?? 19}
        notMarked={2}
        absent={data?.audience ? Math.max(0, data.audience.total - data.audience.present) : 1}
        assigned={10}
        unassigned={5}
        fresh={4}
        hasStarted={showSessionData}
      />

      <AssessmentResultCard
        passCount={data?.assessment?.pass ?? 0}
        failCount={data?.assessment?.fail ?? 0}
        passRate={
          data?.assessment?.totalAttempts
            ? Math.round((data.assessment.pass / data.assessment.totalAttempts) * 100)
            : 0
        }
        hasStarted={showSessionData}
      />

      <TopPerformersCard
        performers={(data?.topPerformers ?? []).map((p) => ({
          id: p.traineeUid,
          name: p.name,
          score: Math.round(p.score),
          maxScore: Math.round(p.maxScore),
          percentage: Math.round(p.percentage),
        }))}
        hasStarted={showSessionData}
      />

      <SessionHeroesCard
        heroes={data?.sessionHeroes ?? []}
        isSessionClosed={isSessionClosed}
        hasStarted={showSessionData}
      />

      {showSessionData && (
        <RuntimeAndQuizSection
          data={data}
          actualRuntime={formatDurationHMS(runtimeSeconds)}
          onAdvanceModule={onAdvanceModule}
          onEndSession={onEndSession}
        />
      )}

      <ExecutionFlowCard executionFlow={data?.executionFlow ?? []} auditLog={data?.auditLog ?? []} hasStarted={showSessionData} />

      {showSessionData && (
        <LiveStudioSection
          conferenceUid={conferenceUid}
          trainerName={data?.trainerName}
          participants={participants}
          onLeaderboard={onLeaderboard}
          onRefresh={onRefresh}
          onMarkAttendance={onMarkAttendance}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
