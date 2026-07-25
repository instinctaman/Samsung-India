import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { Radius } from "@/theme/radius";

const SUCCESS_ANIMATION = require("@/assets/lottie/success-check.json");
const ERROR_ANIMATION = require("@/assets/lottie/error-cross.json");

const MAX_WARNINGS = 3;

const RULES = [
  "Sit facing the camera",
  "Keep your face fully visible",
  "Ensure good lighting",
  "Stay alone during the test",
];

const POSE_ROWS: {
  key: string;
  ok: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}[] = [
  { key: "forward", ok: true, icon: "person", label: "Face looking forward" },
  { key: "left", ok: false, icon: "arrow-back", label: "Face turned left" },
  { key: "right", ok: false, icon: "arrow-forward", label: "Face turned right" },
  { key: "up", ok: false, icon: "arrow-up", label: "Looking up" },
  { key: "down", ok: false, icon: "arrow-down", label: "Looking down" },
  { key: "multiple", ok: false, icon: "people", label: "Multiple people detected" },
];

type Props = {
  onStart: () => void;
};

export default function PreTestInstructions({ onStart }: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.title} weight={FontWeight.semiBold}>Before You Begin</AppText>
        <AppText style={styles.subtitle} color={Colors.gray600}>Please read the following instructions carefully.</AppText>

        <View style={styles.card}>
          {RULES.map((rule) => (
            <View key={rule} style={styles.ruleRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <AppText style={styles.ruleText}>{rule}</AppText>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          {POSE_ROWS.map((row) => (
            <View key={row.key} style={styles.poseRow}>
              <View style={styles.poseAnimation}>
                <LottieView
                  source={row.ok ? SUCCESS_ANIMATION : ERROR_ANIMATION}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
              <Ionicons name={row.icon} size={16} color={row.ok ? Colors.success : Colors.danger} />
              <AppText style={styles.poseLabel}>{row.label}</AppText>
              <Ionicons
                name={row.ok ? "checkmark" : "close"}
                size={16}
                color={row.ok ? Colors.success : Colors.danger}
              />
            </View>
          ))}
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="warning" size={18} color="#B45309" />
          <AppText style={styles.warningText} color="#92400E">
            You will receive a maximum of {MAX_WARNINGS} warnings. After the {MAX_WARNINGS === 3 ? "third" : `${MAX_WARNINGS}th`} warning, your test will be submitted automatically.
          </AppText>
        </View>

        <Pressable style={styles.agreeRow} onPress={() => setAgreed((v) => !v)} hitSlop={8}>
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={13} color={Colors.white} />}
          </View>
          <AppText style={styles.agreeText}>I understand the instructions.</AppText>
        </Pressable>

        <Pressable
          style={[styles.startButton, !agreed && styles.startButtonDisabled]}
          disabled={!agreed}
          onPress={onStart}
        >
          <Ionicons name="play" size={16} color={Colors.white} />
          <AppText color={Colors.white} weight={FontWeight.semiBold}>Start Test</AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 32 },
  title: { fontSize: Fonts.h2, textAlign: "center" },
  subtitle: { fontSize: Fonts.bodySm, textAlign: "center", marginBottom: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: 14,
    gap: 10,
  },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleText: { fontSize: Fonts.bodySm },
  poseRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  poseAnimation: { width: 40, height: 40 },
  lottie: { width: "100%", height: "100%" },
  poseLabel: { fontSize: Fonts.bodySm, flex: 1 },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: Radius.xl,
    padding: 12,
  },
  warningText: { flex: 1, fontSize: Fonts.bodySm, lineHeight: 19 },
  agreeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: Colors.mainColour1, borderColor: Colors.mainColour1 },
  agreeText: { fontSize: Fonts.bodySm },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.mainColour1,
    borderRadius: Radius.xxl,
    height: 52,
    marginTop: 4,
  },
  startButtonDisabled: { opacity: 0.5 },
});
