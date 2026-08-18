import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { TraineeListView } from "@/components/trainee/TraineeListView";
import { useAuth } from "@/hooks/useAuth";
import { TraineeListItem, fetchTraineeList } from "@/api/trainee";

export default function PendingTraineeScreen() {
  const router = useRouter();
  const { adminToken } = useAuth();
  const [items, setItems] = useState<TraineeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode: "load" | "refresh" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      try {
        const data = await fetchTraineeList(adminToken);
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
    <TraineeListView
      title="Pending Trainee List"
      subtitle="View and manage all trainee"
      items={items}
      loading={loading}
      refreshing={refreshing}
      onRefresh={() => load("refresh")}
      onBack={() => router.back()}
      exportFileName="pending-trainee-list"
      emptyLabel="No pending trainees. Everything registered so far has already been reviewed."
    />
  );
}
