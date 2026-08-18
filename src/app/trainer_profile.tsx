import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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

  const handleLogout = () => {
    adminLogout();
    router.replace("/trainer_login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingTop: 4, gap: 4 },
  centered: { paddingVertical: 60, alignItems: "center" },
});
