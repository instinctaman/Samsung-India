import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import Calendar from "@/components/calendar/Calendar";
import AccountPanel from "@/components/trainer/AccountPanel";
import DashboardBottomNav from "@/components/trainer/dashboard/DashboardBottomNav";
import DashboardHeader from "@/components/trainer/dashboard/DashboardHeader";
import QuickActionsCard from "@/components/trainer/dashboard/QuickActionsCard";
import RecentSessionsCard from "@/components/trainer/dashboard/RecentSessionsCard";
import SummaryStatsRow from "@/components/trainer/dashboard/SummaryStatsRow";
import TrainingEfficiencyCard from "@/components/trainer/dashboard/TrainingEfficiencyCard";
import DateDrop from "@/components/trainer/DateDrop";
import SidebarMenu from "@/components/trainer/SidebarMenu";
import TrainingsQuickPanel from "@/components/trainer/TrainingsQuickPanel";
import AppModal from "@/components/ui/AppModal";
import { Colors } from "@/theme/colors";
import { useTrainerDashboard } from "@/hooks/useTrainerDashboard";

export default function TrainerDashboardScreen() {
  const router = useRouter();

  const {
    admin,
    activeTab,
    menuOpen,
    quickActionsOpen,
    accountOpen,
    dateDropOpen,
    datePreset,
    dateRange,
    agenda,
    stats,
    refreshing,
    loadAgenda,
    applyDateRange,
    handleLogout,
    handleLaunch,
    handleNavigate,
    handleBottomNavSelect,
    closePanels,
    setAccountOpen,
    setDateDropOpen,
    setQuickActionsOpen,
  } = useTrainerDashboard();

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadAgenda("refresh")}
              colors={[Colors.mainColour1]}
              tintColor={Colors.mainColour1}
            />
          }
        >
          {/* Header */}
          <DashboardHeader
            name={admin?.name ?? "Demo Trainer"}
            onOpenProfile={() => setAccountOpen(true)}
            onLogout={handleLogout}
          />

          {/* Integrated Calendar Filter Card */}
          <Calendar
            range={dateRange}
            preset={datePreset}
            onApply={applyDateRange}
          />

          {/* 4 Summary Stat Cards */}
          <SummaryStatsRow stats={stats} />

          {/* Training Efficiency Donut Progress Card */}
          <TrainingEfficiencyCard
            stats={stats}
            onOverviewPress={() => setDateDropOpen(true)}
          />

          {/* Two-Column Bottom Section: Recent Sessions & Quick Actions */}
          <View style={styles.twoColumnRow}>
            <RecentSessionsCard
              sessions={agenda}
              onViewAll={() => router.push("/training_list")}
              onSelectSession={handleLaunch}
            />
            <QuickActionsCard
              onCreateTraining={() => router.push("/add_training")}
              onTrainingList={() => router.push("/training_list")}
              onViewReports={() => router.push("/pending_trainings")}
              onAddTrainee={() => setQuickActionsOpen(true)}
            />
          </View>
        </ScrollView>

        {/* Persistent Bottom Navigation */}
        <DashboardBottomNav
          activeTab={activeTab}
          onSelectTab={handleBottomNavSelect}
        />
      </SafeAreaView>

      {/* Modals & Slide-out Drawers */}
      <AppModal
        visible={menuOpen}
        onClose={closePanels}
        position="left"
        contentStyle={styles.leftPanel}
      >
        <SidebarMenu onNavigate={handleNavigate} />
      </AppModal>

      <AppModal
        visible={quickActionsOpen}
        onClose={closePanels}
        position="top"
        contentStyle={styles.topPanel}
      >
        <TrainingsQuickPanel onSelect={handleNavigate} />
      </AppModal>

      <AppModal
        visible={dateDropOpen}
        onClose={() => setDateDropOpen(false)}
        position="top"
        contentStyle={styles.dateDropPanel}
        closeOnOverlayPress
      >
        <DateDrop
          range={dateRange}
          preset={datePreset}
          onApply={applyDateRange}
        />
      </AppModal>

      <AppModal
        visible={accountOpen}
        onClose={() => setAccountOpen(false)}
        position="right"
        contentStyle={styles.rightPanel}
      >
        <AccountPanel
          name={admin?.name ?? "Trainer"}
          role={admin?.role ?? "Trainer"}
          onSettings={() => setAccountOpen(false)}
          onLogout={handleLogout}
        />
      </AppModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  twoColumnRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  leftPanel: {
    width: "80%",
    height: "100%",
  },
  topPanel: {
    width: "100%",
  },
  rightPanel: {
    width: "80%",
    height: "100%",
  },
  dateDropPanel: {
    width: "100%",
    maxHeight: "92%",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
});
