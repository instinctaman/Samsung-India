import { Text, View, StyleSheet } from "react-native";

import { AuditLogEntry } from "@/api/training";
import { formatElapsed } from "./executionFlowUtils";

type AuditLogTableProps = {
  entries: AuditLogEntry[];
};

function formatTime(value: string | null): string {
  if (!value) return "--";
  const parsed = new Date(value.replace(" ", "T"));
  if (isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function AuditLogTable({ entries }: AuditLogTableProps) {
  if (entries.length === 0) {
    return <Text style={styles.empty}>No audit log entries yet.</Text>;
  }

  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.thText, { flex: 1.4 }]}>Module Name</Text>
        <Text style={[styles.thText, { flex: 1.1, textAlign: "center" }]}>Start Time (IST)</Text>
        <Text style={[styles.thText, { flex: 1.1, textAlign: "center" }]}>End Time (OUT)</Text>
        <Text style={[styles.thText, { flex: 0.9, textAlign: "right" }]}>Duration</Text>
      </View>

      {entries.map((entry, idx) => (
        <View key={`${entry.moduleKey}-${entry.runNumber}`} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
          <Text style={[styles.tdModuleName, { flex: 1.4 }]} numberOfLines={1}>
            {entry.label}{entry.runNumber > 1 ? ` (Run ${entry.runNumber})` : ""}
          </Text>
          <Text style={[styles.tdText, { flex: 1.1, textAlign: "center" }]}>{formatTime(entry.startedAt)}</Text>
          <Text style={[styles.tdText, { flex: 1.1, textAlign: "center" }]}>
            {entry.isRunning ? "In progress" : formatTime(entry.endedAt)}
          </Text>
          <Text style={[styles.tdDuration, { flex: 0.9, textAlign: "right" }]}>
            {entry.elapsedSeconds != null ? formatElapsed(entry.elapsedSeconds) : "--"}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 12, color: "#6B7280", textAlign: "center", paddingVertical: 16 },
  table: { borderRadius: 8, overflow: "hidden" },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  thText: { fontSize: 8.5, fontWeight: "700", color: "#4B5563", letterSpacing: 0.2 },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowAlt: { backgroundColor: "#FAFAFA" },
  tdModuleName: { fontSize: 9.5, fontWeight: "600", color: "#111827" },
  tdText: { fontSize: 9, color: "#4B5563" },
  tdDuration: { fontSize: 9, fontWeight: "700", color: "#2563EB" },
});
