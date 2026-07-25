import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import AppCard from "@/components/ui/AppCard";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import SecurityFooter from "@/components/common/SecurityFooter";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { FontWeight } from "@/theme/fontWeight";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, loginAdmin } from "@/api/admin";
const LOGO = require("@/assets/images/logo/project_logo.png");

const SOCIAL_ICONS = [
  { name: "logo-facebook" as const, color: "#1877F2" },
  { name: "logo-google" as const, color: "#EA4335" },
  { name: "logo-instagram" as const, color: "#E1306C" },
  { name: "logo-linkedin" as const, color: "#0A66C2" },
];

export default function TrainerLoginScreen() {
  const router = useRouter();
  const { setAdminSession } = useAuth();
  const { reason } = useLocalSearchParams<{ reason?: string }>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [notice, setNotice] = useState<string | null>(
    reason === "session_expired" ? "Your session expired. Please log in again." : null
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setNotice("Enter your username and password.");
      return;
    }

    setLoading(true);
    setNotice(null);
    try {
      const session = await loginAdmin(username.trim(), password);
      setAdminSession(session);
      if (session.admin.role === "admin") {
        router.replace("/admin_dashboard");
      } else if (session.admin.role === "trainer") {
        router.replace("/trainer_dashboard");
      } else {
        setNotice("This account doesn't have access here yet.");
      }
    } catch (err) {
      setNotice(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={Colors.mainColour1} />
          </Pressable>

          <AppCard style={styles.card}>
            <View style={styles.header}>
              <Image source={LOGO} style={styles.brandLogoImage} />
            </View>

            <View style={styles.body}>
              <AppInput
                label="Username"
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <AppInput
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <View style={styles.optionsRow}>
                <Checkbox label="Show Password" checked={showPassword} onToggle={() => setShowPassword((value) => !value)} />
                <Checkbox label="Remember Me" checked={rememberMe} onToggle={() => setRememberMe((value) => !value)} />
              </View>

              {notice && <AppText style={styles.notice}>{notice}</AppText>}

              <AppButton title="Login" onPress={handleLogin} loading={loading} />

              <AppText style={styles.orText} color={Colors.gray600}>or sign in with other accounts?</AppText>
              <View style={styles.socialRow}>
                {SOCIAL_ICONS.map((social) => (
                  <View key={social.name} style={styles.socialIcon}>
                    <Ionicons name={social.name} size={20} color={social.color} />
                  </View>
                ))}
              </View>

              <Pressable onPress={() => router.back()}>
                <AppText style={styles.websiteText} color={Colors.gray600}>
                  Go to website?{" "}
                  <AppText color={Colors.mainColour1} weight={FontWeight.medium}>Click here.</AppText>
                </AppText>
              </Pressable>
            </View>
          </AppCard>

          <View style={styles.securityFooter}>
            <SecurityFooter />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Checkbox({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.checkboxRow} onPress={onToggle} hitSlop={8}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={12} color={Colors.white} />}
      </View>
      <AppText style={styles.checkboxLabel} color={Colors.gray600}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF4FF" },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  backButton: {
    alignSelf: "flex-start",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brandLogoImage: {width: 176, height: 45 },
  card: { width: "100%" },
  header: { alignItems: "center", paddingTop: 28, paddingBottom: 20, paddingHorizontal: 24 },
  brand: { fontSize: Fonts.h2, letterSpacing: 1 },
  brandSubtitle: { fontSize: Fonts.overline, marginTop: 2, letterSpacing: 0.5 },
  title: { fontSize: Fonts.body, marginTop: 16, textAlign: "center" },
  body: { padding: 20, paddingTop: 4 },
  optionsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, marginTop: -4 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray400,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: Colors.mainColour1, borderColor: Colors.mainColour1 },
  checkboxLabel: { fontSize: Fonts.bodySm },
  notice: { color: Colors.mainColour1, fontSize: Fonts.bodySm, textAlign: "center", marginBottom: 12 },
  orText: { fontSize: Fonts.bodySm, textAlign: "center", marginTop: 18 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 14, marginTop: 14 },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  websiteText: { fontSize: Fonts.bodySm, textAlign: "center", marginTop: 20 },
  securityFooter: { marginTop: 32 },
});
