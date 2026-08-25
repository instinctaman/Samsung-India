import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Share } from "react-native";

import { SessionDashboard, endTraining, fetchSessionDashboard, startTraining } from "@/api/training";
import { DashboardTab } from "@/components/trainer/dashboard/DashboardBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { formatGeneratedTimestamp } from "./formatting";

export function useSessionDashboardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ conferenceUid?: string }>();
  const conferenceUid = params.conferenceUid || "CONF25456581";
  const { adminToken } = useAuth();

  const [data, setData] = useState<SessionDashboard | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [bottomTab, setBottomTab] = useState<DashboardTab>("plan");
  const [moreOpen, setMoreOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [startedForUid, setStartedForUid] = useState(conferenceUid);

  if (startedForUid !== conferenceUid) {
    setStartedForUid(conferenceUid);
    setHasStarted(false);
  }

  const loadData = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "load") setLoading(true);

      try {
        const res = await fetchSessionDashboard(adminToken, conferenceUid);
        setData(res);
        setGeneratedAt(new Date());
      } catch {
        // Fallback / gracefully keep state
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else if (mode === "load") setLoading(false);
      }
    },
    [adminToken, conferenceUid],
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
      const interval = setInterval(() => loadData("silent"), 5000);
      return () => clearInterval(interval);
    }, [loadData]),
  );

  const handleCopyLink = async () => {
    try {
      const url = `https://training.samsung.com/session/${conferenceUid}`;
      await Share.share({ message: `Join Session: ${url}` });
    } catch {
      // Ignored
    }
  };

  const handleStartSession = async () => {
    if (!adminToken) return;
    setHasStarted(true);
    try {
      await startTraining(adminToken, conferenceUid);
      loadData("silent");
    } catch {
      // Fallback / gracefully keep state
    }
  };

  const handleEndSession = () => {
    Alert.alert("End Quiz", "Do you want to end quiz?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          if (adminToken) {
            try {
              await endTraining(adminToken, conferenceUid);
            } catch {
              // Fallback / gracefully keep state
            }
          }
          router.replace("/trainer_dashboard");
        },
      },
    ]);
  };

  const handleBottomNavSelect = (tab: DashboardTab) => {
    setBottomTab(tab);
    if (tab === "home") {
      router.replace("/trainer_dashboard");
    } else if (tab === "plan") {
      router.push("/sessions");
    } else if (tab === "profile") {
      router.push("/trainer_profile");
    } else if (tab === "more") {
      setMoreOpen(true);
    }
  };

  const isSessionClosed = data?.conferenceStatus === "Completed";
  // A closed session already ran to completion, so its Audience Breakdown /
  // Assessment / Execution Flow etc. should render the same populated view as
  // an in-progress session instead of the "not started yet" empty state.
  const showSessionData = hasStarted || isSessionClosed;

  return {
    router,
    conferenceUid,
    data,
    generatedAt: generatedAt ? formatGeneratedTimestamp(generatedAt) : undefined,
    loading,
    refreshing,
    showQR,
    setShowQR,
    bottomTab,
    moreOpen,
    setMoreOpen,
    loadData,
    handleCopyLink,
    handleStartSession,
    handleEndSession,
    handleBottomNavSelect,
    isSessionClosed,
    showSessionData,
  };
}
