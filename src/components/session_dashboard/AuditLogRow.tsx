import { StyleSheet, View } from "react-native";
import AppText from "@/components/ui/AppText";

import { AuditLogEntry } from "@/api/training";
import { useLiveRuntime } from "@/hooks/useLiveRuntime";
import { formatElapsed } from "./executionFlowUtils";

type AuditLogRowProps = {
  entry: AuditLogEntry;
  alt: boolean;
};

function formatTime(value: string | null): string {
  if (!value) return "--";
  const parsed = new Date(value.replace(" ", "T"));
  if (isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function AuditLogRow({ entry, alt }: AuditLogRowProps) {
  // Live while the module is still running, frozen once it stops.
  const seconds = useLiveRuntime(entry.startedAt, entry.endedAt);

  return (
    <View style={[styles.row, alt && styles.rowAlt]}>
      <View style={{ flex: 1.4 }}>
        <AppText style={styles.moduleName} numberOfLines={1}>
          {entry.label}
          {entry.runNumber > 1 ? ` (Run ${entry.runNumber})` : ""}
        </AppText>
        {entry.startedBy && (
          <AppText style={styles.by} numberOfLines={1}>by {entry.startedBy}</AppText>
        )}
      </View>
      <AppText style={[styles.cell, { flex: 1.1, textAlign: "center" }]}>{formatTime(entry.startedAt)}</AppText>
      <AppText style={[styles.cell, { flex: 1.1, textAlign: "center" }]}>
        {entry.isRunning ? "In progress" : formatTime(entry.endedAt)}
      </AppText>
      <AppText style={[styles.duration, { flex: 0.9, textAlign: "right" }]}>
        {entry.startedAt ? formatElapsed(seconds) : "--"}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowAlt: { backgroundColor: "#FAFAFA" },
  moduleName: { fontSize: 9.5, fontWeight: "600", color: "#111827" },
  by: { fontSize: 8, color: "#9CA3AF", marginTop: 1 },
  cell: { fontSize: 9, color: "#4B5563" },
  duration: { fontSize: 9, fontWeight: "700", color: "#2563EB" },
});
