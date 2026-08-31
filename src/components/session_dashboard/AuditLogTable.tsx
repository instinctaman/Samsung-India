import { Text, View, StyleSheet } from "react-native";

import { AuditLogEntry } from "@/api/training";
import { Colors } from "@/theme/colors";
import AuditLogRow from "./AuditLogRow";

type AuditLogTableProps = {
  entries: AuditLogEntry[];
};

export default function AuditLogTable({ entries }: AuditLogTableProps) {
  if (entries.length === 0) {
    return <Text style={styles.empty}>No audit log entries yet.</Text>;
  }

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.th, { flex: 1.4 }]}>Module Name</Text>
        <Text style={[styles.th, { flex: 1.1, textAlign: "center" }]}>Start Time (IST)</Text>
        <Text style={[styles.th, { flex: 1.1, textAlign: "center" }]}>End Time (OUT)</Text>
        <Text style={[styles.th, { flex: 0.9, textAlign: "right" }]}>Duration</Text>
      </View>

      {entries.map((entry, idx) => (
        <AuditLogRow key={`${entry.moduleKey}-${entry.runNumber}`} entry={entry} alt={idx % 2 === 1} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 12, color: "#6B7280", textAlign: "center", paddingVertical: 16 },
  table: { borderRadius: 8, overflow: "hidden" },
  headerRow: {
    flexDirection: "row",
    backgroundColor: Colors.gray50,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  th: { fontSize: 8.5, fontWeight: "700", color: "#4B5563", letterSpacing: 0.2 },
});
