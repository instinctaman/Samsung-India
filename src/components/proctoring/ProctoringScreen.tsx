import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/ui/AppText";
import { Colors } from "@/theme/colors";
import { FontWeight } from "@/theme/fontWeight";
import ProctoringCheckList, {
  DEFAULT_PROCTORING_CHECKS,
} from "./ProctoringCheckList";
import ProctoringHeader from "./ProctoringHeader";
import ProctoringPolicyCheckbox from "./ProctoringPolicyCheckbox";
import ProctoringWarning from "./ProctoringWarning";
import StartTestButton from "./StartTestButton";

export type ProctoringScreenProps = {
  onStartTest: () => void;
  onPolicyPress?: () => void;
  loading?: boolean;
  error?: string | null;
};

export default function ProctoringScreen({
  onStartTest,
  onPolicyPress,
  loading = false,
  error = null,
}: ProctoringScreenProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.screen} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main White Card Container */}
        <View style={styles.mainCard}>
          {/* Top Graphic + Heading */}
          <ProctoringHeader />

          {/* 4 Security Checks */}
          <ProctoringCheckList checks={DEFAULT_PROCTORING_CHECKS} />

          {/* Important Warning Banner */}
          <ProctoringWarning />

          {/* Policy Checkbox */}
          <ProctoringPolicyCheckbox
            checked={agreed}
            onChange={setAgreed}
            onPolicyPress={onPolicyPress}
          />

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={Colors.danger} />
              <AppText style={styles.errorText} color={Colors.danger}>
                {error}
              </AppText>
            </View>
          )}

          {/* CTA: I'm ready, Start Test */}
          <StartTestButton
            title="I'm ready, Start Test"
            onPress={onStartTest}
            disabled={!agreed || loading}
            loading={loading}
          />

          {/* Footer Security Note */}
          <View style={styles.footerNote}>
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={13} color="#00A859" />
            </View>
            <AppText style={styles.footerText} weight={FontWeight.medium}>
              Your data is secure and encrypted
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EDF4FC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 22,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    flex: 1,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
  },
  lockBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#D4F4E4",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#4B5563",
  },
});
