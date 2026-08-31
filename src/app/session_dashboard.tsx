import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import { SessionDashboardHeader } from "@/components/session_dashboard";
import {
  DashboardScrollContent,
  SessionQRModal,
  TrainerCheckInModal,
  useSessionDashboardScreen,
} from "@/components/session_dashboard/dashboard-screen";
import DashboardBottomNav from "@/components/trainer/dashboard/DashboardBottomNav";
import TrainerMoreMenu from "@/components/trainer/dashboard/TrainerMoreMenu";

export default function SessionDashboardScreen() {
  const {
    router,
    conferenceUid,
    data,
    generatedAt,
    loading,
    refreshing,
    showQR,
    setShowQR,
    showCheckInModal,
    setShowCheckInModal,
    bottomTab,
    moreOpen,
    setMoreOpen,
    loadData,
    handleCopyLink,
    handleStartSession,
    handleConfirmStartSession,
    handleMarkAttendance,
    handleAdvanceModule,
    handleEndSession,
    handleBottomNavSelect,
    isSessionClosed,
    showSessionData,
    isLive,
    isApproved,
  } = useSessionDashboardScreen();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SessionDashboardHeader
        conferenceUid={conferenceUid}
        isClosed={isSessionClosed}
        hasStarted={showSessionData}
        isLive={isLive}
        isApproved={isApproved}
        loading={loading}
        timestamp={generatedAt}
        onBack={() => router.back()}
        onCopyLink={handleCopyLink}
        onShowQR={() => setShowQR(true)}
        onRefresh={() => loadData("refresh")}
        onReport={() => router.push({ pathname: "/session_report", params: { conferenceUid } })}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
      />

      <DashboardScrollContent
        conferenceUid={conferenceUid}
        data={data}
        isSessionClosed={isSessionClosed}
        showSessionData={showSessionData}
        refreshing={refreshing}
        onRefresh={() => loadData("refresh")}
        onAdvanceModule={handleAdvanceModule}
        onMarkAttendance={handleMarkAttendance}
        onEndSession={handleEndSession}
        onLeaderboard={() => router.push({ pathname: "/quiz_leaderboard", params: { conferenceUid } })}
      />

      <DashboardBottomNav activeTab={bottomTab} onSelectTab={handleBottomNavSelect} />

      <TrainerMoreMenu visible={moreOpen} onClose={() => setMoreOpen(false)} />

      <SessionQRModal visible={showQR} onClose={() => setShowQR(false)} conferenceUid={conferenceUid} />

      <TrainerCheckInModal
        visible={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onConfirm={handleConfirmStartSession}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7FA",
  },
});
