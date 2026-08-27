/**
 * useTrainerAgendaList Hook
 * Manages fetching trainer agenda sessions with support for filtering
 * pending-only sessions or viewing all sessions, with focus effect and pull-to-refresh.
 */

import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";

export function useTrainerAgendaList(filterPendingOnly = false) {
  const { adminToken } = useAuth();
  const [items, setItems] = useState<TrainingAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode: "load" | "refresh" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      try {
        const data = await fetchTrainerAgenda(adminToken);
        setItems(
          filterPendingOnly
            ? data.trainings.filter((item) => item.approvalStatus === "Pending")
            : data.trainings,
        );
      } catch {
        setItems([]);
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else setLoading(false);
      }
    },
    [adminToken, filterPendingOnly],
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return {
    items,
    loading,
    refreshing,
    refresh: () => load("refresh"),
  };
}
