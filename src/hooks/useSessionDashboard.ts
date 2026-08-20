/**
 * useSessionDashboard Hook
 * Encapsulates session dashboard data fetching, 5s polling interval,
 * share link generation, ending session API mutation, and modal/tab states.
 */

import { useCallback, useState } from "react";
import { Alert, Share } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import {
  endTraining,
  fetchSessionDashboard,
  SessionDashboard,
} from "@/api/training";
import { DashboardTab } from "@/components/trainer/dashboard/DashboardBottomNav";

export function useSessionDashboard(conferenceUid: string) {
  const router = useRouter();
  const { adminToken } = useAuth();

  const [data, setData] = useState<SessionDashboard | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [bottomTab, setBottomTab] = useState<DashboardTab>("plan");

  const loadData = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);

      try {
        const res = await fetchSessionDashboard(adminToken, conferenceUid);
        setData(res);
      } catch {
        // Graceful state preservation
      } finally {
        if (mode === "refresh") setRefreshing(false);
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
      await Share.share({
        message: `Join Session: ${url}`,
      });
    } catch {
      // Ignored
    }
  };

  const handleEndSession = () => {
    Alert.alert(
      "End Session",
      "Are you sure you want to end this training session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: async () => {
            if (adminToken) {
              try {
                await endTraining(adminToken, conferenceUid);
              } catch {
                // Handled
              }
            }
            router.back();
          },
        },
      ],
    );
  };

  const handleBottomNavSelect = (tab: DashboardTab) => {
    setBottomTab(tab);
    if (tab === "home") {
      router.replace("/trainer_dashboard");
    } else if (tab === "plan") {
      router.push("/sessions");
    } else if (tab === "profile") {
      router.push("/profile");
    }
  };

  return {
    data,
    refreshing,
    showQR,
    setShowQR,
    bottomTab,
    loadData,
    handleCopyLink,
    handleEndSession,
    handleBottomNavSelect,
  };
}
