import { useCallback, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";

import { AttendanceListView } from "@/components/attendance/AttendanceListView";
import { useAuth } from "@/hooks/useAuth";
import { AttendanceListItem, fetchAttendanceList } from "@/api/attendanceList";

export default function ConfirmedAttendanceScreen() {
  const router = useRouter();
  const { adminToken } = useAuth();
  const [items, setItems] = useState<AttendanceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode: "load" | "refresh" = "load") => {
      if (!adminToken) return;
      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);
      try {
        const data = await fetchAttendanceList(adminToken);
        setItems(data.filter((item) => item.marked));
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
    <AttendanceListView
      title="Confirmed Attendance List"
      subtitle="View and manage all attendance"
      items={items}
      loading={loading}
      refreshing={refreshing}
      onRefresh={() => load("refresh")}
      onBack={() => router.back()}
      exportFileName="confirmed-attendance-list"
      emptyLabel="No confirmed attendance yet."
    />
  );
}
