import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";
import { DatePreset, DateRange, rangeForPreset } from "@/components/trainer/DateDrop";
import { useAuth } from "@/hooks/useAuth";
import { calculateDashboardStats } from "./dashboardUtils";
import { toApiDate } from "./TrainerMoreMenu";

export type TrainerDashboardTab = "home" | "plan" | "profile" | "more";

export function useTrainerDashboardScreen() {
  const router = useRouter();
  const { admin, adminToken, adminLogout } = useAuth();

  const [activeTab, setActiveTab] = useState<TrainerDashboardTab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
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
      params: { start: toApiDate(range.start), end: toApiDate(range.end) },
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
  };

  const handleBottomNavSelect = (tab: TrainerDashboardTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      // Return to home view
    } else if (tab === "plan") {
      router.push({
        pathname: "/sessions",
        params: { start: toApiDate(dateRange.start), end: toApiDate(dateRange.end) },
      });
    } else if (tab === "profile") {
      router.push("/trainer_profile");
    } else if (tab === "more") {
      setMenuOpen(true);
    }
  };

  return {
    router,
    admin,
    activeTab,
    menuOpen,
    dateDropOpen,
    setDateDropOpen,
    datePreset,
    dateRange,
    agenda,
    loadingAgenda,
    refreshing,
    stats,
    loadAgenda,
    applyDateRange,
    handleLogout,
    handleLaunch,
    closePanels,
    handleBottomNavSelect,
  };
}
