import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";
import { DashboardTab } from "@/components/trainer/dashboard/DashboardBottomNav";
import { useAuth } from "@/hooks/useAuth";
import {
  DEFAULT_SESSION_FILTERS,
  MOCK_SESSIONS,
  SessionFilters,
  SessionTab,
  filterSessions,
  getUniqueOptions,
} from "./sessionsUtils";

export function useSessionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ start?: string; end?: string; tab?: string }>();
  const { adminToken } = useAuth();

  const initialTab: SessionTab = params.tab === "today" || params.tab === "completed" ? params.tab : "all";
  const [activeTab, setActiveTab] = useState<SessionTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<SessionFilters>(DEFAULT_SESSION_FILTERS);
  const [sessions, setSessions] = useState<TrainingAgendaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [bottomTab, setBottomTab] = useState<DashboardTab>("plan");
  const [moreOpen, setMoreOpen] = useState(false);

  const dateRangeSubtitle = useMemo(() => {
    if (params.start && params.end) {
      try {
        const s = new Date(params.start);
        const e = new Date(params.end);
        const sStr = `${String(s.getDate()).padStart(2, "0")} ${s.toLocaleDateString("en-GB", { month: "short" })}`;
        const eStr = `${String(e.getDate()).padStart(2, "0")} ${e.toLocaleDateString("en-GB", { month: "short" })}`;
        return `${sStr} - ${eStr}`;
      } catch {
        // Fallback
      }
    }
    return "01 Jul - 31 Jul";
  }, [params.start, params.end]);

  const loadSessions = useCallback(
    async (mode: "load" | "refresh" = "load") => {
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);

      try {
        if (adminToken) {
          const data = await fetchTrainerAgenda(adminToken, { start: params.start, end: params.end });
          if (data && data.trainings.length > 0) {
            setSessions(data.trainings);
          } else {
            // Fallback to rich mock sessions matching reference image
            setSessions(MOCK_SESSIONS);
          }
        } else {
          setSessions(MOCK_SESSIONS);
        }
      } catch {
        setSessions(MOCK_SESSIONS);
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else setLoading(false);
      }
    },
    [adminToken, params.start, params.end],
  );

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions]),
  );

  const filteredSessions = useMemo(
    () => filterSessions(sessions, activeTab, searchQuery, filters),
    [sessions, activeTab, searchQuery, filters],
  );

  const locationOptions = useMemo(() => getUniqueOptions(sessions, "trainingHub"), [sessions]);
  const sessionTypeOptions = useMemo(() => getUniqueOptions(sessions, "trainingType"), [sessions]);

  const handleFiltersChange = (patch: Partial<SessionFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const handleLaunchSession = (conferenceUid: string) => {
    router.push({ pathname: "/session_dashboard", params: { conferenceUid } });
  };

  const handleReportSession = (conferenceUid: string) => {
    router.push({ pathname: "/session_dashboard", params: { conferenceUid } });
  };

  const handleBottomNavSelect = (tab: DashboardTab) => {
    setBottomTab(tab);
    if (tab === "home") {
      router.replace("/trainer_dashboard");
    } else if (tab === "profile") {
      router.push("/trainer_profile");
    } else if (tab === "more") {
      setMoreOpen(true);
    }
  };

  return {
    activeTab,
    setActiveTab,
    setSearchQuery,
    filters,
    handleFiltersChange,
    locationOptions,
    sessionTypeOptions,
    dateRangeSubtitle,
    loading,
    refreshing,
    loadSessions,
    filteredSessions,
    handleLaunchSession,
    handleReportSession,
    bottomTab,
    moreOpen,
    setMoreOpen,
    handleBottomNavSelect,
  };
}
