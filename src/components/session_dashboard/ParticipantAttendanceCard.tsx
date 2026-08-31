import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import ParticipantRow from "./ParticipantRow";
import { ParticipantItem } from "./sessionDashboardTypes";
import SuspiciousActivityModal from "./SuspiciousActivityModal";
import UnlockExamModal from "./UnlockExamModal";

type ParticipantAttendanceCardProps = {
  participants: ParticipantItem[];
  onRefresh?: () => void;
  onCheck?: (id: string) => void;
  onReject?: (id: string) => void;
  onUnlock?: (id: string, reason: string) => void;
};

export default function ParticipantAttendanceCard({
  participants,
  onRefresh,
  onCheck,
  onReject,
  onUnlock,
}: ParticipantAttendanceCardProps) {
  const [search, setSearch] = useState("");
  const [suspicious, setSuspicious] = useState<ParticipantItem | null>(null);
  const [unlockTarget, setUnlockTarget] = useState<ParticipantItem | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const handleConfirmUnlock = (reason: string) => {
    if (unlockTarget) {
      setUnlockedIds((prev) => new Set(prev).add(unlockTarget.id));
      onUnlock?.(unlockTarget.id, reason);
    }
    setUnlockTarget(null);
  };

  const q = search.trim().toLowerCase();
  const filtered = q
    ? participants.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.employeeId.toLowerCase().includes(q) || p.phone.includes(q),
      )
    : participants;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="people" size={18} color="#111827" />
          <Text style={styles.title}>PARTICIPANT MASTER LIST</Text>
        </View>
        <Pressable style={styles.refreshBtn} onPress={onRefresh} hitSlop={6}>
          <Ionicons name="reload" size={11} color="#374151" />
          <Text style={styles.refreshText}>Refresh Data</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>{participants.length} joined</Text>
        <View style={styles.searchBox}>
          <Text style={styles.filterLabel}>Search:</Text>
          <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} />
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.thRow}>
          <Text style={[styles.thText, { flex: 1.3 }]}>PARTICIPANT{"\n"}DETAILS</Text>
          <Text style={[styles.thText, { flex: 1.1 }]}>AUDIENCE{"\n"}TYPE</Text>
          <Text style={[styles.thText, { flex: 0.8 }]}>STATUS</Text>
          <Text style={[styles.thText, { flex: 1.1 }]}>IN-OUT</Text>
          <Text style={[styles.thText, { flex: 0.9 }]}>CONTROLS</Text>
        </View>

        {filtered.length === 0 ? (
          <Text style={styles.empty}>
            {participants.length === 0 ? "No one has joined yet." : "No match."}
          </Text>
        ) : (
          filtered.map((item, idx) => {
            const isLocked =
              !!item.proctoring &&
              item.proctoring.flags >= item.proctoring.maxFlags &&
              !unlockedIds.has(item.id);
            return (
              <ParticipantRow
                key={item.id}
                item={item}
                alt={idx % 2 === 1}
                isLocked={isLocked}
                onCheck={() => onCheck?.(item.id)}
                onReject={() => onReject?.(item.id)}
                onShowSuspicious={() => setSuspicious(item)}
                onUnlock={() => setUnlockTarget(item)}
              />
            );
          })
        )}
      </View>

      {filtered.length > 0 && (
        <Text style={styles.paginationInfo}>
          Showing {filtered.length} of {participants.length}
        </Text>
      )}

      <SuspiciousActivityModal participant={suspicious} onClose={() => setSuspicious(null)} />
      <UnlockExamModal
        participant={unlockTarget}
        onCancel={() => setUnlockTarget(null)}
        onConfirm={handleConfirmUnlock}
      />
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
    marginBottom: 20,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 11.5, fontWeight: "800", color: "#111827", letterSpacing: 0.3 },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  refreshText: { fontSize: 9, color: "#374151", fontWeight: "600" },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filterLabel: { fontSize: 8.5, color: "#4B5563" },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    width: 110,
    height: 24,
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  table: { borderRadius: 8, overflow: "hidden" },
  thRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  thText: { fontSize: 8, fontWeight: "700", color: "#374151", textAlign: "center", lineHeight: 10.5 },
  empty: { fontSize: 10, color: "#6B7280", textAlign: "center", paddingVertical: 18 },
  paginationInfo: { fontSize: 8, color: "#6B7280", marginTop: 8 },
});
