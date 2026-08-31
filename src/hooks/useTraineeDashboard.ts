import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { CurrentSession, getCurrentSession } from "@/api/session";
import { TrainingRowData } from "@/components/trainee/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { getTodayFormattedDate } from "@/utils/formatDisplayDate";

export function useTraineeDashboard() {
  const router = useRouter();
  const { trainee, token, logout } = useAuth();

  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadActiveSession = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getCurrentSession(token);
      setSession(data);
    } catch {
      // Graceful fallback if no active session
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadActiveSession();
  }, [loadActiveSession]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActiveSession();
    setRefreshing(false);
  };

  const handleJoinSession = () => {
    router.push("/session_detail");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  // Build training details table with active session dynamically
  const trainings: TrainingRowData[] = [
    {
      id: "1",
      status: "Present",
      date: "21 May 2025",
      day: "(Wed)",
      postTestScore: "85/100",
      postTestTrend: "up",
      quizScore: "70/100",
      quizTrend: "up",
      ranking: "#120",
      rankingScope: "Global",
    },
    {
      id: "2",
      status: "Absent",
      date: "18 May 2025",
      day: "(Sun)",
      postTestScore: "60/100",
      postTestTrend: "down",
      quizScore: "50/100",
      quizTrend: "down",
      ranking: "#210",
      rankingScope: "Global",
    },
    {
      id: "3",
      status: session?.confirmationStatus === "Confirmed" ? "Present" : "Scheduled",
      date: session?.date || getTodayFormattedDate(),
      day: "(Today)",
      postTestScore: "-",
      postTestTrend: "none",
      quizScore: "-",
      quizTrend: "none",
      ranking: "-",
      isLiveOrScheduled: true,
    },
    {
      id: "4",
      status: "Present",
      date: "14 May 2025",
      day: "(Wed)",
      postTestScore: "92/100",
      postTestTrend: "up",
      quizScore: "88/100",
      quizTrend: "up",
      ranking: "#95",
      rankingScope: "State",
    },
    {
      id: "5",
      status: "Present",
      date: "10 May 2025",
      day: "(Sat)",
      postTestScore: "78/100",
      postTestTrend: "up",
      quizScore: "65/100",
      quizTrend: "up",
      ranking: "#160",
      rankingScope: "Global",
    },
  ];

  return {
    trainee,
    session,
    loading,
    refreshing,
    trainings,
    handleRefresh,
    handleJoinSession,
    handleLogout,
  };
}
