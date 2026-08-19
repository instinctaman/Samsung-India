import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";
import Calendar from "@/components/calendar/Calendar";
import DashboardBottomNav from "@/components/trainer/dashboard/DashboardBottomNav";
import DashboardHeader from "@/components/trainer/dashboard/DashboardHeader";
import { calculateDashboardStats } from "@/components/trainer/dashboard/dashboardUtils";
import QuickActionsCard from "@/components/trainer/dashboard/QuickActionsCard";
import RecentSessionsCard from "@/components/trainer/dashboard/RecentSessionsCard";
import SummaryStatsRow from "@/components/trainer/dashboard/SummaryStatsRow";
import TrainingEfficiencyCard from "@/components/trainer/dashboard/TrainingEfficiencyCard";
import DateDrop, {
  DatePreset,
  DateRange,
  rangeForPreset,
} from "@/components/trainer/DateDrop";
import TrainerMoreMenu, { toApiDate, useTrainerNavigate } from "@/components/trainer/dashboard/TrainerMoreMenu";
import TrainingsQuickPanel from "@/components/trainer/TrainingsQuickPanel";
import AppModal from "@/components/ui/AppModal";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/theme/colors";

export default function TrainerDashboardScreen() {
  const router = useRouter();
  const { admin, adminToken, adminLogout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "home" | "plan" | "profile" | "more"
  >("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [dateDropOpen, setDateDropOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("today");
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    rangeForPreset("today", { start: new Date(), end: new Date() }),
  );
  const [agenda, setAgenda] = useState<TrainingAgendaItem[]>([]);
  const [loadingAgenda, setLoadingAgenda] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => calculateDashboardStats(agenda), [agenda]);

  const loadAgenda = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "load") setLoadingAgenda(true);
      try {
        const data = await fetchTrainerAgenda(adminToken, {
          start: toApiDate(dateRange.start),
          end: toApiDate(dateRange.end),
        });
        setAgenda(data);
      } catch {
        if (mode !== "silent") setAgenda([]);
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else if (mode === "load") setLoadingAgenda(false);
      }
    },
    [adminToken, dateRange],
  );

  useFocusEffect(
    useCallback(() => {
      loadAgenda();
      const interval = setInterval(() => loadAgenda("silent"), 10000);
      return () => clearInterval(interval);
    }, [loadAgenda]),
  );

  const applyDateRange = (range: DateRange, preset: DatePreset) => {
    setDateRange(range);
    setDatePreset(preset);
    setDateDropOpen(false);
    router.push({
      pathname: "/sessions",
      params: {
        start: toApiDate(range.start),
        end: toApiDate(range.end),
      },
    });
  };

  const handleLogout = () => {
    adminLogout();
    router.replace("/trainer_login");
  };

  const handleLaunch = (conferenceUid: string) => {
    router.push({ pathname: "/session_dashboard", params: { conferenceUid } });
  };

  const closePanels = () => {
    setMenuOpen(false);
    setQuickActionsOpen(false);
  };

  const navigate = useTrainerNavigate(dateRange);
  const handleNavigate = (label: string) => {
    closePanels();
    navigate(label);
  };

  const handleBottomNavSelect = (tab: "home" | "plan" | "profile" | "more") => {
    setActiveTab(tab);
    if (tab === "home") {
      // Return to home view
    } else if (tab === "plan") {
      router.push({
        pathname: "/sessions",
        params: {
          start: toApiDate(dateRange.start),
          end: toApiDate(dateRange.end),
        },
      });
    } else if (tab === "profile") {
      router.push("/trainer_profile");
    } else if (tab === "more") {
      setMenuOpen(true);
    }
  };

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
            onOpenProfile={() => router.push("/trainer_profile")}
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
      <TrainerMoreMenu visible={menuOpen} onClose={closePanels} dateRange={dateRange} />

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
  topPanel: {
    width: "100%",
  },
  dateDropPanel: {
    width: "100%",
    maxHeight: "92%",
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
});
