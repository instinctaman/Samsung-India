import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  RecentSessionsModal,
  SessionNotification,
  SessionTimeline,
  TraineeBottomNavigation,
  TrainingSessionHeader,
  WaitingCard,
} from "@/components/session";
import AppText from "@/components/ui/AppText";
import { useTraineeHome } from "@/hooks/useTraineeHome";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";

export default function SessionDetailScreen() {
  const insets = useSafeAreaInsets();
  const {
    trainee,
    token,
    session,
    activities,
    loading,
    refreshing,
    error,
    notAssigned,
    activeTab,
    historyVisible,
    setHistoryVisible,
    loadSession,
    handleMarkAttendance,
    handleEnterLiveQuiz,
    handleEnterPostTest,
    handleEnterSurvey,
    handleLogout,
    handleTabSelect,
    router,
  } = useTraineeHome();

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={[styles.statusBarBackground, { height: insets.top }]} />
        <StatusBar style="light" animated />

        {/* Training Session Royal Blue Header */}
        <TrainingSessionHeader
          onLogout={handleLogout}
          onHistoryPress={() => setHistoryVisible(true)}

          userName={trainee?.name ?? "Anshu Pandey"}
          gender={trainee?.gender}
          profilePhoto={trainee?.profilePhoto}
          isOnline={true}
          confirmationStatus={session?.confirmationStatus ?? "Not Confirmed"}
          sessionType={session?.sessionType ?? "One-Day Session"}
          title={session?.title ?? "Training Session"}
          date={session?.date ?? "06 Jun 2026"}
          location={session?.location ?? "New Delhi"}
        />

        {/* Main Content Area */}
        <View style={styles.body}>
          {loading && !session ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.headerBlue} size="large" />
            </View>
          ) : notAssigned ? (
            <View style={styles.centered}>
              <WaitingCard
                title="No Session Assigned"
                subtitle="No session is assigned yet"
              />
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <AppText style={styles.errorText}>{error}</AppText>
              <Pressable
                style={styles.retryButton}
                onPress={() => loadSession()}
                accessibilityRole="button"
                accessibilityLabel="Retry loading session"
              >
                <AppText color={Colors.white}>Retry</AppText>
              </Pressable>
            </View>
          ) : session && !session.started ? (
            <View style={styles.centered}>
              <WaitingCard
                title="Session hasn't started yet"
                subtitle="Trainer will unlock soon as it's available"
              />
            </View>
          ) : (
            <SessionTimeline
              activities={activities}
              onMarkAttendance={handleMarkAttendance}
              onEnterQuiz={handleEnterLiveQuiz}
              onEnterPostTest={handleEnterPostTest}
              onEnterSurvey={handleEnterSurvey}
              footerComponent={<SessionNotification />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadSession("refresh")}
                  colors={[Colors.headerBlue]}
                  tintColor={Colors.headerBlue}
                />
              }
            />
          )}
        </View>

        {/* Fixed Trainee Bottom Navigation */}
        <TraineeBottomNavigation
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
        />
      </SafeAreaView>

      {/* Session History Modal */}
      <RecentSessionsModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        token={token}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusBarBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Colors.headerBlue,
  },
  body: {
    flex: 1,
    minHeight: 0,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.headerBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
