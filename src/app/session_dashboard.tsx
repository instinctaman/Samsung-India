import { useLocalSearchParams, useRouter } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActiveQuizModuleCard,
  AssessmentResultCard,
  AudienceBreakdownCard,
  ExecutionFlowCard,
  LiveStudioCard,
  ParticipantAttendanceCard,
  SessionDashboardHeader,
  SessionDetailsCard,
  SessionHeroesCard,
  SessionRuntimeCard,
  TopPerformersCard,
} from "@/components/session_dashboard";
import DashboardBottomNav from "@/components/trainer/dashboard/DashboardBottomNav";
import AppModal from "@/components/ui/AppModal";
import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import { useSessionDashboard } from "@/hooks/useSessionDashboard";

export default function SessionDashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ conferenceUid?: string }>();
  const conferenceUid = params.conferenceUid || "CONF25456581";

  const {
    data,
    refreshing,
    showQR,
    setShowQR,
    bottomTab,
    loadData,
    handleCopyLink,
    handleEndSession,
    handleBottomNavSelect,
  } = useSessionDashboard(conferenceUid);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 1. Header Banner */}
      <SessionDashboardHeader
        conferenceUid={conferenceUid}
        onBack={() => router.back()}
        onCopyLink={handleCopyLink}
        onShowQR={() => setShowQR(true)}
        onRefresh={() => loadData("refresh")}
        onReport={() => {}}
        onEndSession={handleEndSession}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData("refresh")}
            colors={[Colors.mainColour1]}
            tintColor={Colors.mainColour1}
          />
        }
      >
        {/* 2. Session Details Card */}
        <SessionDetailsCard
          topic="Webinar"
          date={data?.conferenceDate || "20 Jul 2026"}
          trainerName={data?.trainerName || "Demo Trainer"}
          runtime="Runtime : 02h 31m"
        />

        {/* 3. Audience Breakdown Card */}
        <AudienceBreakdownCard
          totalAudience={data?.audience?.total ?? 22}
          present={data?.audience?.present ?? 19}
          notMarked={2}
          absent={
            data?.audience
              ? Math.max(0, data.audience.total - data.audience.present)
              : 1
          }
          assigned={10}
          unassigned={5}
          fresh={4}
        />

        {/* 4. Assessment Result Card */}
        <AssessmentResultCard
          passCount={data?.assessment?.pass ?? 14}
          failCount={data?.assessment?.fail ?? 4}
          passRate={
            data?.assessment?.totalAttempts
              ? Math.round(
                  (data.assessment.pass / data.assessment.totalAttempts) * 100,
                )
              : 82
          }
        />

        {/* 5. Top Performers Card */}
        <TopPerformersCard />

        {/* 6. Session Heroes Section */}
        <SessionHeroesCard />

        {/* 7. Runtime & Completion Card */}
        <SessionRuntimeCard
          actualRuntime="4h 42m 46s"
          assignedTime="00h 42m"
          consumedTime="04h 22m"
          timeUsedPercent={92}
          moduleCompletionPercent={50}
        />

        {/* 8. Active Quiz Module Card */}
        <ActiveQuizModuleCard
          moduleName={
            data?.activeModuleId
              ? `Quiz Module (${data.activeModuleId})`
              : "Quiz Module\n(Classroom Quiz Smartphone)"
          }
          targetedQps="Targeted 24 QPs"
          timer="01:20:47"
          onEndQuiz={handleEndSession}
        />

        {/* 9. Execution Flow & Audit Logs Card */}
        <ExecutionFlowCard />

        {/* 10. Live Studio Card */}
        <LiveStudioCard
          onLaunchNext={() => {}}
          onStopTimer={() => {}}
          onLeaderboard={() => {
            router.push({
              pathname: "/quiz_leaderboard",
              params: { conferenceUid },
            });
          }}
          onLock={() => {}}
        />

        {/* 11. Participant Attendance Card */}
        <ParticipantAttendanceCard
          onRefresh={() => loadData("refresh")}
          onCheck={() => {}}
          onPlay={() => {}}
          onMessage={() => {}}
        />
      </ScrollView>

      {/* Persistent Bottom Navigation */}
      <DashboardBottomNav
        activeTab={bottomTab}
        onSelectTab={handleBottomNavSelect}
      />

      {/* QR Code Modal */}
      <AppModal
        visible={showQR}
        onClose={() => setShowQR(false)}
        position="center"
        closeOnOverlayPress
      >
        <View style={styles.qrModalContent}>
          <AppText style={styles.qrTitle} weight={FontWeight.bold}>
            Session QR Code
          </AppText>
          <AppText style={styles.qrSubtitle}>
            Scan to join conference: {conferenceUid}
          </AppText>
          <View style={styles.qrBox}>
            <QRCode
              value={`https://training.samsung.com/session/${conferenceUid}`}
              size={180}
            />
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7FA",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  qrModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
  },
  qrTitle: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  qrBox: {
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
