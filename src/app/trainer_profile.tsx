import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import DashboardBottomNav, { DashboardTab } from "@/components/trainer/dashboard/DashboardBottomNav";
import TrainerMoreMenu from "@/components/trainer/dashboard/TrainerMoreMenu";
import { Colors } from "@/theme/colors";
import { useAuth } from "@/hooks/useAuth";
import {
  DocumentsSection,
  LocalAddressSection,
  OfficialInfoSection,
  PersonalDetailsSection,
  ProfileHeaderCard,
  SecuritySection,
  SocialMediaSection,
  useTrainerProfileForm,
} from "@/components/trainer/profile";

export default function TrainerProfileScreen() {
  const router = useRouter();
  const { admin, adminLogout } = useAuth();
  const form = useTrainerProfileForm();
  const [bottomTab, setBottomTab] = useState<DashboardTab>("profile");
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    router.replace("/trainer_login");
  };

  const handleBottomNavSelect = (tab: DashboardTab) => {
    setBottomTab(tab);
    if (tab === "home") {
      router.replace("/trainer_dashboard");
    } else if (tab === "plan") {
      router.push("/sessions");
    } else if (tab === "more") {
      setMoreOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeaderCard name={admin?.name ?? "Demo Trainer"} onLogout={handleLogout} />

        {form.loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={Colors.mainColour1} />
          </View>
        ) : (
          <>
            <PersonalDetailsSection form={form} />
            <LocalAddressSection form={form} />
            <DocumentsSection form={form} />
            <SocialMediaSection form={form} />
            <OfficialInfoSection form={form} />
            <SecuritySection form={form} />
          </>
        )}
      </ScrollView>

      <DashboardBottomNav activeTab={bottomTab} onSelectTab={handleBottomNavSelect} />

      <TrainerMoreMenu visible={moreOpen} onClose={() => setMoreOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, padding: 16, paddingTop: 4, paddingBottom: 16, gap: 4 },
  centered: { paddingVertical: 60, alignItems: "center" },
});
