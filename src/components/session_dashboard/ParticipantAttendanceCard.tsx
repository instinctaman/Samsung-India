import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { ParticipantItem } from "./sessionDashboardTypes";
import SuspiciousActivityModal from "./SuspiciousActivityModal";
import UnlockExamModal from "./UnlockExamModal";

type ParticipantAttendanceCardProps = {
  participants?: ParticipantItem[];
  onRefresh?: () => void;
  onCheck?: (id: string) => void;
  onReject?: (id: string) => void;
  onUnlock?: (id: string, reason: string) => void;
};

const DEFAULT_PARTICIPANTS: ParticipantItem[] = [
  {
    id: "1",
    name: "AMIT KUMAR",
    employeeId: "TRN364145",
    phone: "9186641771",
    attendeeType: "ASSIGNED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
  },
  {
    id: "2",
    name: "SUMIT VERMA",
    employeeId: "TRN364146",
    phone: "9186641772",
    attendeeType: "ASSIGNED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
  },
  {
    id: "3",
    name: "ANSHU ROY",
    employeeId: "TRN364147",
    phone: "9186641773",
    attendeeType: "ASSIGNED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
  },
  {
    id: "4",
    name: "PRIYANKA",
    employeeId: "TRN364148",
    phone: "9186641774",
    attendeeType: "ASSIGNED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
  },
  {
    id: "5",
    name: "ANKIT KUMAR",
    employeeId: "TRN364149",
    phone: "9186641775",
    attendeeType: "NOT ALLOCATED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
  },
  {
    id: "6",
    name: "HIMANSHU",
    employeeId: "TRN364150",
    phone: "9186641776",
    attendeeType: "NOT ALLOCATED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
  },
  {
    id: "7",
    name: "ANAND RAI",
    employeeId: "TRN364151",
    phone: "9584125789",
    attendeeType: "NOT ALLOCATED",
    status: "PRESENT",
    inTime: "IN: 09:13 AM",
    outTime: "OUT: 10:25AM",
    proctoring: {
      flags: 3,
      maxFlags: 3,
      logs: [
        { timestamp: "17-Aug 11:08:16 AM", strikeNumber: 1, reason: "Tab Switch or Phone Call (Away for >10s)", attemptsLeft: 2 },
        { timestamp: "17-Aug 11:12:41 AM", strikeNumber: 2, reason: "Tab Switch or Phone Call (Away for >10s)", attemptsLeft: 1 },
        { timestamp: "17-Aug 11:19:03 AM", strikeNumber: 3, reason: "Tab Switch or Phone Call (Away for >10s)", attemptsLeft: 0 },
      ],
    },
  },
  {
    id: "8",
    name: "SHUBHAM",
    employeeId: "TRN364152",
    phone: "9186641778",
    attendeeType: "NOT ALLOCATED",
    status: "ABSENT",
    inTime: "IN: 09:30 AM",
    outTime: "OUT: --",
  },
  {
    id: "9",
    name: "AJAY SINGH",
    employeeId: "TRN364153",
    phone: "9186641779",
    attendeeType: "NOT ALLOCATED",
    status: "ABSENT",
    inTime: "IN: 09:40 AM",
    outTime: "OUT: --",
  },
];

export default function ParticipantAttendanceCard({
  participants = DEFAULT_PARTICIPANTS,
  onRefresh,
  onCheck,
  onReject,
  onUnlock,
}: ParticipantAttendanceCardProps) {
  const [search, setSearch] = useState("");
  const [suspiciousParticipant, setSuspiciousParticipant] = useState<ParticipantItem | null>(null);
  const [unlockTarget, setUnlockTarget] = useState<ParticipantItem | null>(null);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  const handleConfirmUnlock = (reason: string) => {
    if (unlockTarget) {
      setUnlockedIds((prev) => new Set(prev).add(unlockTarget.id));
      onUnlock?.(unlockTarget.id, reason);
    }
    setUnlockTarget(null);
  };

  const filtered = participants.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.employeeId.includes(q) ||
      p.phone.includes(q)
    );
  });

  return (
    <View style={styles.card}>
      {/* Header */}
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

      {/* Filter Controls: Show entries | Search */}
      <View style={styles.filterRow}>
        <View style={styles.showEntries}>
          <Text style={styles.filterLabel}>Show</Text>
          <View style={styles.entriesPill}>
            <Text style={styles.entriesText}>50</Text>
            <Ionicons name="chevron-down" size={9} color="#374151" />
          </View>
          <Text style={styles.filterLabel}>entries</Text>
        </View>

        <View style={styles.searchBox}>
          <Text style={styles.filterLabel}>Search:</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder=""
          />
        </View>
      </View>

      {/* Table Content */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.thRow}>
          <Text style={[styles.thText, { flex: 1.3 }]}>PARTICIPANT{"\n"}DETAILS</Text>
          <Text style={[styles.thText, { flex: 1.1 }]}>AUDIENCE{"\n"}TYPE</Text>
          <Text style={[styles.thText, { flex: 0.8 }]}>STATUS</Text>
          <Text style={[styles.thText, { flex: 1.1 }]}>IN-OUT</Text>
          <Text style={[styles.thText, { flex: 0.9 }]}>CONTROLS</Text>
        </View>

        {/* Rows */}
        {filtered.map((item, idx) => {
          const isPresent = item.status === "PRESENT";
          const isAssigned = item.attendeeType === "ASSIGNED";
          const isLocked =
            !!item.proctoring &&
            item.proctoring.flags >= item.proctoring.maxFlags &&
            !unlockedIds.has(item.id);

          return (
            <View
              key={item.id}
              style={[styles.trRow, idx % 2 === 1 && styles.trRowAlt]}
            >
              {/* Participant Details */}
              <View style={[styles.participantDetailsCol, { flex: 1.3 }]}>
                <Text style={styles.pName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.pEmpId}>{item.employeeId}</Text>
                <Text style={styles.pPhone}>{item.phone}</Text>
              </View>

              {/* Audience Type Pill */}
              <View style={[styles.attendeeTypeCol, { flex: 1.1 }]}>
                <View
                  style={[
                    styles.typePill,
                    {
                      backgroundColor: isAssigned ? "#FFFBEB" : Colors.gray50,
                      borderColor: isAssigned ? "#FDE68A" : "#D1D5DB",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typePillText,
                      { color: isAssigned ? "#D97706" : "#6B7280" },
                    ]}
                    numberOfLines={1}
                  >
                    {item.attendeeType}
                  </Text>
                </View>
              </View>

              {/* Status Pill */}
              <View style={[styles.statusCol, { flex: 0.8 }]}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: isPresent ? "#ECFDF5" : "#FEF2F2",
                      borderColor: isPresent ? "#A7F3D0" : "#FECACA",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isPresent ? "#10B981" : "#EF4444" },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* IN / OUT */}
              <View style={[styles.inOutCol, { flex: 1.1 }]}>
                <Text style={styles.inText}>{item.inTime}</Text>
                <Text style={styles.outText}>{item.outTime}</Text>
              </View>

              {/* Controls */}
              <View style={[styles.logisticsColWrap, { flex: 0.9 }]}>
                {isLocked && (
                  <Pressable
                    style={styles.lockedPill}
                    onPress={() => setSuspiciousParticipant(item)}
                    hitSlop={3}
                  >
                    <Ionicons name="lock-closed" size={9} color="#EF4444" />
                    <Text style={styles.lockedPillText}>
                      LOCKED ({item.proctoring!.flags}/{item.proctoring!.maxFlags})
                    </Text>
                  </Pressable>
                )}
                <View style={styles.logisticsCol}>
                  {isLocked && (
                    <Pressable
                      onPress={() => setUnlockTarget(item)}
                      hitSlop={2}
                      style={[styles.iconBtn, styles.iconBtnWarning]}
                    >
                      <Ionicons name="lock-closed" size={10} color="#B45309" />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => onCheck?.(item.id)}
                    hitSlop={2}
                    style={[styles.iconBtn, styles.iconBtnSuccess]}
                  >
                    <Ionicons name="checkmark" size={11} color="#10B981" />
                  </Pressable>
                  <Pressable
                    onPress={() => onReject?.(item.id)}
                    hitSlop={2}
                    style={[styles.iconBtn, styles.iconBtnDanger]}
                  >
                    <Ionicons name="close" size={11} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Pagination Footer */}
      <View style={styles.paginationRow}>
        <Text style={styles.paginationInfo}>
          Showing 1 to {filtered.length} of {participants.length} entries
        </Text>
        <View style={styles.paginationButtons}>
          <Pressable style={styles.pageBtn}>
            <Text style={styles.pageBtnText}>Previous</Text>
          </Pressable>
          <View style={styles.pageNumberActive}>
            <Text style={styles.pageNumberActiveText}>1</Text>
          </View>
          <Pressable style={styles.pageBtn}>
            <Text style={styles.pageBtnText}>Next</Text>
          </Pressable>
        </View>
      </View>

      <SuspiciousActivityModal
        participant={suspiciousParticipant}
        onClose={() => setSuspiciousParticipant(null)}
      />

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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 11.5,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
  },
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
  refreshText: {
    fontSize: 9,
    color: "#374151",
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  showEntries: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterLabel: {
    fontSize: 8.5,
    color: "#4B5563",
  },
  entriesPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  entriesText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#111827",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
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
  table: {
    borderRadius: 8,
    overflow: "hidden",
  },
  thRow: {
    flexDirection: "row",
    backgroundColor: "#FAFAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  thText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    lineHeight: 10.5,
  },
  trRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  trRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  participantDetailsCol: {
    gap: 1,
  },
  pName: {
    fontSize: 8.5,
    fontWeight: "700",
    color: "#111827",
  },
  pEmpId: {
    fontSize: 7,
    color: "#0066FF",
    fontWeight: "600",
  },
  pPhone: {
    fontSize: 7,
    color: "#6B7280",
  },
  attendeeTypeCol: {
    alignItems: "center",
    paddingHorizontal: 2,
  },
  typePill: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1.5,
    maxWidth: "100%",
  },
  typePillText: {
    fontSize: 6,
    fontWeight: "700",
  },
  statusCol: {
    alignItems: "center",
  },
  statusPill: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
  },
  statusPillText: {
    fontSize: 6.5,
    fontWeight: "700",
  },
  inOutCol: {
    alignItems: "center",
    gap: 1,
  },
  inText: {
    fontSize: 6.5,
    color: "#10B981",
    fontWeight: "600",
  },
  outText: {
    fontSize: 6.5,
    color: "#EF4444",
    fontWeight: "600",
  },
  logisticsColWrap: {
    alignItems: "flex-end",
    gap: 3,
  },
  logisticsCol: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  lockedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    borderRadius: 5,
    paddingHorizontal: 1,
    paddingVertical: 2,
    marginRight: -1
  },
  lockedPillText: {
    fontSize: 6,
    fontWeight: "800",
    color: "#EF4444"
    
  },
  iconBtn: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
  iconBtnSuccess: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  iconBtnDanger: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  iconBtnWarning: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  paginationInfo: {
    fontSize: 8,
    color: "#6B7280",
  },
  paginationButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  pageBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  pageBtnText: {
    fontSize: 8,
    color: "#374151",
  },
  pageNumberActive: {
    backgroundColor: "#0066FF",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  pageNumberActiveText: {
    fontSize: 8,
    color: Colors.white,
    fontWeight: "700",
  },
});
