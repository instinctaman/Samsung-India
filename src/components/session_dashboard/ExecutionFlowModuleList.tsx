import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ExecutionFlowItem } from "@/api/training";
import { getElapsedDisplay, getExecutionStatusPresentation, getModuleVisual } from "./executionFlowUtils";

type ExecutionFlowModuleListProps = {
  modules: ExecutionFlowItem[];
  onRestart?: (moduleKey: string) => void;
  onViewTopPerformers?: (moduleKey: string) => void;
};

export default function ExecutionFlowModuleList({
  modules,
  onRestart,
  onViewTopPerformers,
}: ExecutionFlowModuleListProps) {
  if (modules.length === 0) {
    return <Text style={styles.empty}>No modules configured for this session.</Text>;
  }

  return (
    <View style={styles.list}>
      {modules.map((item) => {
        const visual = getModuleVisual(item.moduleKey);
        const status = getExecutionStatusPresentation(item.status);
        const elapsed = getElapsedDisplay(item);

        return (
          <View key={item.moduleKey} style={styles.row}>
            <View style={styles.rowMain}>
              <View style={[styles.iconWrap, { backgroundColor: visual.bg }]}>
                <Ionicons name={visual.icon} size={16} color="#FFFFFF" />
              </View>
              <View style={styles.textCol}>
                <Text style={styles.title}>{item.label} Module</Text>
                <Text style={styles.subtitle}>
                  {visual.categoryLabel}
                  {item.assignedMinutes != null ? ` | Assigned: ${item.assignedMinutes}m` : ""}
                </Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                {elapsed && <Text style={[styles.elapsedText, { color: status.color }]}>{elapsed}</Text>}
              </View>
            </View>

            {item.status === "Completed" && (
              <Pressable style={styles.actionBtn} onPress={() => onRestart?.(item.moduleKey)}>
                <Ionicons name="refresh" size={12} color="#4B5563" />
                <Text style={styles.actionText}>Restart</Text>
              </Pressable>
            )}

            {item.status === "Running" && (
              <View style={styles.actionRow}>
                <Pressable style={styles.actionBtnOutline} onPress={() => onViewTopPerformers?.(item.moduleKey)}>
                  <Ionicons name="stats-chart" size={12} color="#2563EB" />
                  <Text style={styles.actionTextBlue}>Top Performers</Text>
                </Pressable>
                <View style={styles.liveDot}>
                  <View style={styles.liveDotIndicator} />
                  <Text style={styles.liveDotText}>Running</Text>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  empty: { fontSize: 12, color: "#6B7280", textAlign: "center", paddingVertical: 16 },
  row: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAECF0",
    padding: 10,
    gap: 8,
  },
  rowMain: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  textCol: { flex: 1, gap: 2 },
  title: { fontSize: 12.5, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 9.5, fontWeight: "600", color: "#9CA3AF", letterSpacing: 0.3 },
  statusPill: { alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 2 },
  statusText: { fontSize: 9.5, fontWeight: "700" },
  elapsedText: { fontSize: 9.5, fontWeight: "600" },
  actionBtn: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: { fontSize: 10, fontWeight: "600", color: "#4B5563" },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionTextBlue: { fontSize: 10, fontWeight: "600", color: "#2563EB" },
  liveDot: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#DC2626",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  liveDotIndicator: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#FFFFFF" },
  liveDotText: { fontSize: 10, fontWeight: "700", color: "#FFFFFF" },
});
