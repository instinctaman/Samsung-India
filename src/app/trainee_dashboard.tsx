import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { TraineeBottomNavigation, TrainingSessionHeader } from "@/components/session";
import {
  Global_Percentage,
  TraineeMetricsGrid,
  TrainingDetailsTable,
} from "@/components/trainee/dashboard";
import { TraineeTab } from "@/hooks/useTraineeHome";
import { useTraineeDashboard } from "@/hooks/useTraineeDashboard";
import { Colors } from "@/theme/colors";

export default function TraineeDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TraineeTab>("home");

  const {
    trainee,
    session,
    refreshing,
    trainings,
    handleRefresh,
    handleJoinSession,
    handleLogout,
  } = useTraineeDashboard();

  const handleTabSelect = (tab: TraineeTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      // Already on Trainee Dashboard
    } else if (tab === "rank") {
      router.push({ pathname: "/session_detail", params: { tab: "rank" } });
    } else if (tab === "profile") {
      router.push("/profile");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <StatusBar style="light" animated />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.headerBlue]}
            tintColor={Colors.headerBlue}
          />
        }
      >
        {/* Header */}
        <TrainingSessionHeader
          userName={trainee?.name || "Anshu Pandey"}
          gender={trainee?.gender}
          profilePhoto={trainee?.profilePhoto}
          confirmationStatus={session?.confirmationStatus || "Not Confirmed"}
          sessionType={session?.sessionType || "One-Day Session"}
          title={session?.title || "Training Session"}
          date={session?.date || "06 Jun 2026"}
          location={session?.location || "New Delhi"}
          isOnline={true}
          onLogout={handleLogout}
        />

        {/* 4 Metric Stats Grid */}
        <TraineeMetricsGrid
          totalTrainings={32}
          presentCount={18}
          absentCount={6}
          scheduledCount={8}
        />

        {/* Global Percentage & Rankings Section */}
        <Global_Percentage
          percentage={90}
          totalScore={90}
          maxScore={100}
          periodGain={10}
          globalRank="# 1,245"
          globalPercentile={18}
          stateRank="# 85"
          statePercentile={12}
        />

        {/* Training Details Table with Join Button */}
        <TrainingDetailsTable
          trainings={trainings}
          onJoinSession={handleJoinSession}
        />
      </ScrollView>

      {/* Floating Bottom Navigation (Rank, Raised Home, Profile) */}
      <TraineeBottomNavigation activeTab={activeTab} onSelectTab={handleTabSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.headerBlue,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  quickLinksSection: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
});
