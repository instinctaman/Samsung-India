import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppModal from "@/components/ui/AppModal";
import { ParticipantItem } from "./sessionDashboardTypes";

type SuspiciousActivityModalProps = {
  participant: ParticipantItem | null;
  onClose: () => void;
};

export default function SuspiciousActivityModal({ participant, onClose }: SuspiciousActivityModalProps) {
  const proctoring = participant?.proctoring;

  return (
    <AppModal
      visible={!!participant}
      onClose={onClose}
      position="center"
      contentStyle={styles.sheet}
    >
      <View style={styles.header}>
        <Ionicons name="warning" size={16} color="#F59E0B" />
        <Text style={styles.title}>SUSPICIOUS ACTIVITY</Text>
      </View>
      <View style={styles.divider} />

      <Text style={styles.metaLine}>
        Participant: <Text style={styles.metaValue}>{participant?.name}</Text>
      </Text>
      <Text style={styles.metaLine}>
        Flags: <Text style={styles.metaValue}>{proctoring?.flags ?? 0}/{proctoring?.maxFlags ?? 3}</Text>
      </Text>

      <Text style={styles.logsLabel}>LOGS:</Text>
      <ScrollView style={styles.logsList}>
        {proctoring?.logs.map((log, idx) => (
          <View key={idx} style={styles.logRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.logText}>
              [{log.timestamp}] Strike #{log.strikeNumber}: {log.reason} (Attempts left: {log.attemptsLeft})
            </Text>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#0B0F19",
    borderRadius: 12,
    padding: 16,
    width: "88%",
    maxHeight: "70%",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 13, fontWeight: "800", color: "#F59E0B", letterSpacing: 0.5 },
  divider: { borderTopWidth: 1, borderTopColor: "#374151", borderStyle: "dashed", marginTop: 10, marginBottom: 10 },
  metaLine: { fontSize: 12, color: "#9CA3AF", marginBottom: 4 },
  metaValue: { color: "#F3F4F6", fontWeight: "700" },
  logsLabel: { fontSize: 12, fontWeight: "800", color: "#F3F4F6", marginTop: 12, marginBottom: 8 },
  logsList: { maxHeight: 220 },
  logRow: { flexDirection: "row", gap: 6, marginBottom: 10, paddingRight: 4 },
  bullet: { color: "#9CA3AF", fontSize: 12 },
  logText: { flex: 1, fontSize: 11, color: "#D1D5DB", lineHeight: 16 },
  closeBtn: { marginTop: 8, alignSelf: "flex-end" },
  closeText: { fontSize: 13, color: "#3B82F6", fontWeight: "700" },
});
