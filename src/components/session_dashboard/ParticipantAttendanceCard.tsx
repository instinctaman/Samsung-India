import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Shadows } from "@/theme/shadows";
import { ParticipantItem } from "./sessionDashboardTypes";

type ParticipantAttendanceCardProps = {
  participants?: ParticipantItem[];
  onRefresh?: () => void;
  onCheck?: (id: string) => void;
  onPlay?: (id: string) => void;
  onMessage?: (id: string) => void;
};

const DEFAULT_PARTICIPANTS: ParticipantItem[] = [
  {
    id: "1",
    name: "AMRIT KUMAR",
    employeeId: "191024961",
    phone: "9186641771",
    attendeeType: "REGISTERED",
    status: "PRESENT",
    inTime: "IN: 09:15 AM",
    outTime: "OUT: 01:23 PM",
  },
  {
    id: "2",
    name: "VIJAY VERMA",
    employeeId: "191024962",
    phone: "9186641772",
    attendeeType: "REGISTERED",
    status: "PRESENT",
    inTime: "IN: 09:16 AM",
    outTime: "OUT: 01:23 PM",
  },
  {
    id: "3",
    name: "VIBHU DUTT",
    employeeId: "191024963",
    phone: "9186641773",
    attendeeType: "REGISTERED",
    status: "PRESENT",
    inTime: "IN: 09:18 AM",
    outTime: "OUT: 01:23 PM",
  },
  {
    id: "4",
    name: "PRAVEEN K",
    employeeId: "191024964",
    phone: "9186641774",
    attendeeType: "REGISTERED",
    status: "PRESENT",
    inTime: "IN: 09:15 AM",
    outTime: "OUT: 01:23 PM",
  },
  {
    id: "5",
    name: "AMIT KUMAR",
    employeeId: "191024965",
    phone: "9186641775",
    attendeeType: "GUEST (UNREGISTERED)",
    status: "PRESENT",
    inTime: "IN: 09:15 AM",
    outTime: "OUT: 01:23 PM",
  },
  {
    id: "6",
    name: "VIKASH ROY",
    employeeId: "191024966",
    phone: "9186641776",
    attendeeType: "GUEST (UNREGISTERED)",
    status: "PRESENT",
    inTime: "IN: 09:15 AM",
    outTime: "OUT: 01:23 PM",
  },
  {
    id: "7",
    name: "ANAND SINGH",
    employeeId: "191024967",
    phone: "9186641777",
    attendeeType: "GUEST (UNREGISTERED)",
    status: "ABSENT",
    inTime: "IN: --",
    outTime: "OUT: --",
  },
  {
    id: "8",
    name: "PANKAJ SAH",
    employeeId: "191024968",
    phone: "9186641778",
    attendeeType: "GUEST (UNREGISTERED)",
    status: "ABSENT",
    inTime: "IN: --",
    outTime: "OUT: --",
  },
  {
    id: "9",
    name: "AJAY PRASAD",
    employeeId: "191024969",
    phone: "9186641779",
    attendeeType: "GUEST (UNREGISTERED)",
    status: "ABSENT",
    inTime: "IN: --",
    outTime: "OUT: --",
  },
];

export default function ParticipantAttendanceCard({
  participants = DEFAULT_PARTICIPANTS,
  onRefresh,
  onCheck,
  onPlay,
  onMessage,
}: ParticipantAttendanceCardProps) {
  const [search, setSearch] = useState("");

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
          <Ionicons name="people" size={16} color={Colors.mainColour1} />
          <Text style={styles.title}>PARTICIPANT ATTENDANCE</Text>
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
            <Text style={styles.entriesText}>10</Text>
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
          <Text style={[styles.thText, { flex: 1.3 }]}>PARTICIPANT DETAILS</Text>
          <Text style={[styles.thText, { flex: 1.1, textAlign: "center" }]}>
            ATTENDEE TYPE
          </Text>
          <Text style={[styles.thText, { flex: 0.8, textAlign: "center" }]}>
            STATUS
          </Text>
          <Text style={[styles.thText, { flex: 1.1, textAlign: "center" }]}>
            IN / OUT
          </Text>
          <Text style={[styles.thText, { flex: 0.9, textAlign: "right" }]}>
            LOGISTICS
          </Text>
        </View>

        {/* Rows */}
        {filtered.map((item, idx) => {
          const isPresent = item.status === "PRESENT";
          const isRegistered = item.attendeeType === "REGISTERED";

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

              {/* Attendee Type Pill */}
              <View style={[styles.attendeeTypeCol, { flex: 1.1 }]}>
                <View
                  style={[
                    styles.typePill,
                    {
                      backgroundColor: isRegistered ? "#FFFBEB" : "#F3F4F6",
                      borderColor: isRegistered ? "#FDE68A" : "#E5E7EB",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typePillText,
                      { color: isRegistered ? "#D97706" : "#6B7280" },
                    ]}
                    numberOfLines={1}
                  >
                    {isRegistered ? "REGISTERED" : "GUEST (UNREGISTERED)"}
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

              {/* Logistics Actions */}
              <View style={[styles.logisticsCol, { flex: 0.9 }]}>
                <Pressable
                  onPress={() => onCheck?.(item.id)}
                  hitSlop={3}
                  style={styles.iconBtn}
                >
                  <Ionicons name="checkmark" size={10} color="#10B981" />
                </Pressable>
                <Pressable
                  onPress={() => onPlay?.(item.id)}
                  hitSlop={3}
                  style={styles.iconBtn}
                >
                  <Ionicons name="play" size={9} color="#EF4444" />
                </Pressable>
                <Pressable
                  onPress={() => onMessage?.(item.id)}
                  hitSlop={3}
                  style={styles.iconBtn}
                >
                  <Ionicons name="mail" size={9} color="#6B7280" />
                </Pressable>
                <Pressable hitSlop={3} style={styles.iconBtn}>
                  <Ionicons name="chevron-down" size={9} color="#6B7280" />
                </Pressable>
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
    backgroundColor: "#F3F4F6",
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
    gap: 2,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  entriesText: {
    fontSize: 8.5,
    fontWeight: "600",
    color: "#111827",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    width: 60,
    height: 18,
    fontSize: 8.5,
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
  },
  thRow: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  thText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#4B5563",
    letterSpacing: 0.1,
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
  logisticsCol: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
  },
  iconBtn: {
    width: 15,
    height: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
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
