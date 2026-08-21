import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
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
import { FontWeight } from "@/theme/typography";
import { useTrainerLogin } from "@/hooks/useTrainerLogin";

const LOGO = require("@/assets/images/logo/project_logo.png");

const SOCIAL_ICONS = [
  { name: "logo-facebook" as const, color: "#1877F2" },
  { name: "logo-google" as const, color: "#EA4335" },
  { name: "logo-instagram" as const, color: "#E1306C" },
  { name: "logo-linkedin" as const, color: "#0A66C2" },
];

export default function TrainerLoginScreen() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason?: string }>();

  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    notice,
    loading,
    handleLogin,
  } = useTrainerLogin(reason);

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              hitSlop={8}
            >
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
                  <Checkbox
                    label="Show Password"
                    checked={showPassword}
                    onToggle={() => setShowPassword((value) => !value)}
                  />
                  <Checkbox
                    label="Remember Me"
                    checked={rememberMe}
                    onToggle={() => setRememberMe((value) => !value)}
                  />
                </View>

                {notice && (
                  <AppText variant="caption" color={Colors.mainColour1} align="center" style={styles.notice}>
                    {notice}
                  </AppText>
                )}

                <AppButton title="Login" onPress={handleLogin} loading={loading} />

                <AppText variant="caption" color={Colors.gray600} align="center" style={styles.orText}>
                  or sign in with other accounts?
                </AppText>
                <View style={styles.socialRow}>
                  {SOCIAL_ICONS.map((social) => (
                    <View key={social.name} style={styles.socialIcon}>
                      <Ionicons
                        name={social.name}
                        size={20}
                        color={social.color}
                      />
                    </View>
                  ))}
                </View>

                <Pressable onPress={() => router.back()}>
                  <AppText variant="caption" color={Colors.gray600} align="center" style={styles.websiteText}>
                    Go to website?{" "}
                    <AppText variant="caption" color={Colors.mainColour1} weight={FontWeight.medium}>
                      Click here.
                    </AppText>
                  </AppText>
                </Pressable>
              </View>
            </AppCard>

            <View style={styles.securityFooter}>
              <SecurityFooter />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable style={styles.checkboxRow} onPress={onToggle} hitSlop={8}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Ionicons name="checkmark" size={12} color={Colors.white} />
        )}
      </View>
      <AppText variant="caption" color={Colors.gray600}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF4FF" },
  keyboardView: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
  brandLogoImage: { width: 176, height: 45 },
  card: { width: "100%" },
  header: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  body: { padding: 20, paddingTop: 4 },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: -4,
  },
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
  checkboxChecked: {
    backgroundColor: Colors.mainColour1,
    borderColor: Colors.mainColour1,
  },
  notice: {
    marginBottom: 12,
  },
  orText: { marginTop: 18 },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 14,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  websiteText: { marginTop: 20 },
  securityFooter: { marginTop: 32 },
});
