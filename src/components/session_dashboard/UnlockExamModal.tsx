import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppModal from "@/components/ui/AppModal";
import { ParticipantItem } from "./sessionDashboardTypes";

type UnlockExamModalProps = {
  participant: ParticipantItem | null;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
};

export default function UnlockExamModal({ participant, onCancel, onConfirm }: UnlockExamModalProps) {
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    setReason("");
    onCancel();
  };

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    setReason("");
    onConfirm(trimmed);
  };

  return (
    <AppModal
      visible={!!participant}
      onClose={handleCancel}
      position="center"
      contentStyle={styles.sheet}
    >
      <View style={styles.header}>
        <Ionicons name="warning" size={16} color="#F59E0B" />
        <Text style={styles.title}>UNLOCK EXAM FOR : {participant?.name}</Text>
      </View>

      <Text style={styles.label}>Please enter reason:</Text>
      <TextInput
        style={styles.input}
        value={reason}
        onChangeText={setReason}
        placeholder=""
        placeholderTextColor="#6B7280"
        multiline
      />

      <View style={styles.actionsRow}>
        <Pressable onPress={handleCancel} hitSlop={8}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleConfirm} disabled={!reason.trim()} hitSlop={8}>
          <Text style={[styles.okText, !reason.trim() && styles.okTextDisabled]}>OK</Text>
        </Pressable>
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#1F2530",
    borderRadius: 12,
    padding: 18,
    width: "88%",
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  title: { flex: 1, fontSize: 14, fontWeight: "800", color: "#F3F4F6", lineHeight: 19 },
  label: { fontSize: 12, color: "#D1D5DB", marginTop: 18, marginBottom: 8 },
  input: {
    backgroundColor: "#343B47",
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    color: "#F3F4F6",
    textAlignVertical: "top",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 18,
  },
  cancelText: { fontSize: 13, color: "#60A5FA", fontWeight: "600" },
  okText: { fontSize: 13, color: "#60A5FA", fontWeight: "800" },
  okTextDisabled: { opacity: 0.4 },
});
