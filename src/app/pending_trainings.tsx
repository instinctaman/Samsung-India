import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { TrainingListView, pendingStatusColumn } from "@/components/training/TrainingListView";
import { useAuth } from "@/hooks/useAuth";
import { TrainingAgendaItem, fetchTrainerAgenda } from "@/api/training";

export default function PendingTrainingsScreen() {
  const router = useRouter();
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
        setItems(data.filter((item) => item.approvalStatus === "Pending"));
      } catch {
        setItems([]);
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else setLoading(false);
      }
    },
    [adminToken]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <TrainingListView
      title="Pending Training List"
      subtitle="View and manage all trainings"
      items={items}
      loading={loading}
      refreshing={refreshing}
      onRefresh={() => load("refresh")}
      onBack={() => router.back()}
      onEdit={(row) => router.push({ pathname: "/session_dashboard", params: { conferenceUid: row.conferenceUid } })}
      statusColumn={pendingStatusColumn()}
      exportFileName="pending-training-list"
      emptyLabel="No pending trainings. Everything you've scheduled has already been reviewed by an admin."
    />
  );
}
