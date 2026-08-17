import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { ExecutionFlowRow } from "./sessionDashboardTypes";

type ExecutionFlowCardProps = {
  rows?: ExecutionFlowRow[];
};

const DEFAULT_ROWS: ExecutionFlowRow[] = [
  {
    id: "1",
    moduleName: "History Module",
    startTime: "11:07 AM",
    endTime: "11:54 AM",
    duration: "47m 10s",
  },
  {
    id: "2",
    moduleName: "Test Module",
    startTime: "11:57 AM",
    endTime: "12:15 PM",
    duration: "17m 15s",
  },
  {
    id: "3",
    moduleName: "QnA Module",
    startTime: "12:15 PM",
    endTime: "1:01 PM",
    duration: "45m 25s",
  },
  {
    id: "4",
    moduleName: "Assessment Module",
    startTime: "01:02 PM",
    endTime: "01:34 PM",
    duration: "31m 55s",
  },
];

export default function ExecutionFlowCard({
  rows = DEFAULT_ROWS,
}: ExecutionFlowCardProps) {
  const [activeTab, setActiveTab] = useState<"flow" | "logs">("logs");

  return (
    <View style={styles.card}>
      {/* Tabs Header: EXECUTION FLOW | Audit Logs */}
      <View style={styles.tabsHeader}>
        <Pressable
          style={[styles.tab, activeTab === "flow" && styles.tabActive]}
          onPress={() => setActiveTab("flow")}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={14}
            color={activeTab === "flow" ? "#2563EB" : "#6B7280"}
          />
          <Text
            style={[styles.tabText, activeTab === "flow" && styles.tabTextActive]}
          >
            EXECUTION FLOW
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === "logs" && styles.tabActive]}
          onPress={() => setActiveTab("logs")}
        >
          <Ionicons
            name="shield-checkmark-outline"
            size={14}
            color={activeTab === "logs" ? "#2563EB" : "#6B7280"}
          />
          <Text
            style={[styles.tabText, activeTab === "logs" && styles.tabTextActive]}
          >
            Audit Logs
          </Text>
        </Pressable>
      </View>

      {/* Table Content */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.thText, { flex: 1.4 }]}>Module Name</Text>
          <Text style={[styles.thText, { flex: 1.1, textAlign: "center" }]}>
            Start Time (IST)
          </Text>
          <Text style={[styles.thText, { flex: 1.1, textAlign: "center" }]}>
            End Time (OUT)
          </Text>
          <Text style={[styles.thText, { flex: 0.9, textAlign: "right" }]}>
            Duration
          </Text>
        </View>

        {/* Table Rows */}
        {rows.map((row, idx) => (
          <View
            key={row.id}
            style={[
              styles.tableRow,
              idx % 2 === 1 && styles.tableRowAlt,
            ]}
          >
            <Text style={[styles.tdModuleName, { flex: 1.4 }]} numberOfLines={1}>
              {row.moduleName}
            </Text>
            <Text style={[styles.tdText, { flex: 1.1, textAlign: "center" }]}>
              {row.startTime}
            </Text>
            <Text style={[styles.tdText, { flex: 1.1, textAlign: "center" }]}>
              {row.endTime}
            </Text>
            <Text style={[styles.tdDuration, { flex: 0.9, textAlign: "right" }]}>
              {row.duration}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: "#EAECF0",
    padding: 12,
    marginHorizontal: 14,
    marginTop: 10,
    ...Shadows.card,
  },
  tabsHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#2563EB",
  },
  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  thText: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#4B5563",
    letterSpacing: 0.2,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  tdModuleName: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#111827",
  },
  tdText: {
    fontSize: 9,
    color: "#4B5563",
  },
  tdDuration: {
    fontSize: 9,
    fontWeight: "700",
    color: "#2563EB",
  },
});
