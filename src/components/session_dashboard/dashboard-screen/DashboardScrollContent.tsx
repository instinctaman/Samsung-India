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
import { Colors } from "@/theme/colors";
import { formatRuntimeLabel } from "./formatting";
import LiveStudioSection from "./LiveStudioSection";
import RuntimeAndQuizSection from "./RuntimeAndQuizSection";

type DashboardScrollContentProps = {
  data: SessionDashboard | null;
  isSessionClosed: boolean;
  showSessionData: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onEndSession: () => void;
  onLeaderboard: () => void;
};

export default function DashboardScrollContent({
  data,
  isSessionClosed,
  showSessionData,
  refreshing,
  onRefresh,
  onEndSession,
  onLeaderboard,
}: DashboardScrollContentProps) {
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
        runtime={formatRuntimeLabel(data?.runtimeSeconds)}
        conferenceStatus={data?.conferenceStatus || "Ongoing"}
        hasStarted={showSessionData}
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
        passCount={data?.assessment?.pass ?? 14}
        failCount={data?.assessment?.fail ?? 4}
        passRate={
          data?.assessment?.totalAttempts ? Math.round((data.assessment.pass / data.assessment.totalAttempts) * 100) : 82
        }
        hasStarted={showSessionData}
      />

      <TopPerformersCard hasStarted={showSessionData} />

      <SessionHeroesCard isSessionClosed={isSessionClosed} hasStarted={showSessionData} />

      {showSessionData && <RuntimeAndQuizSection activeModuleId={data?.activeModuleId} onEndQuiz={onEndSession} />}

      <ExecutionFlowCard executionFlow={data?.executionFlow ?? []} auditLog={data?.auditLog ?? []} hasStarted={showSessionData} />

      {showSessionData && <LiveStudioSection onLeaderboard={onLeaderboard} onRefresh={onRefresh} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
