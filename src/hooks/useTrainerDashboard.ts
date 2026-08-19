/**
 * useTrainerDashboard Hook
 * Manages trainer agenda data fetching, 10s polling interval, stats calculations,
 * date range filtering, and dashboard modal/drawer navigation states.
 */

import { useCallback, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";
import { calculateDashboardStats } from "@/components/trainer/dashboard/dashboardUtils";
import {
  DatePreset,
  DateRange,
  rangeForPreset,
} from "@/components/trainer/DateDrop";

const pad2 = (n: number) => String(n).padStart(2, "0");
const toApiDate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export type DashboardBottomNavTab = "home" | "plan" | "profile" | "more";

export function useTrainerDashboard() {
  const router = useRouter();
  const { admin, adminToken, adminLogout } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardBottomNavTab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [dateDropOpen, setDateDropOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("today");
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    rangeForPreset("today", { start: new Date(), end: new Date() }),
  );
  const [agenda, setAgenda] = useState<TrainingAgendaItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => calculateDashboardStats(agenda), [agenda]);

  const loadAgenda = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
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
    setAccountOpen(false);
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

  const handleNavigate = (label: string) => {
    closePanels();
    if (label === "Add New Trainings") {
      router.push("/add_training");
    } else if (label === "Pending Trainings") {
      router.push("/pending_trainings");
    } else if (label === "Training List") {
      router.push("/training_list");
    }
  };

  const handleBottomNavSelect = (tab: DashboardBottomNavTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      // Home tab
    } else if (tab === "plan") {
      router.push({
        pathname: "/sessions",
        params: {
          start: toApiDate(dateRange.start),
          end: toApiDate(dateRange.end),
        },
      });
    } else if (tab === "profile") {
      setAccountOpen(true);
    } else if (tab === "more") {
      setMenuOpen(true);
    }
  };

  return {
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
  };
}
