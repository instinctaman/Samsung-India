import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AppCard from "@/components/ui/AppCard";
import AuthHeader from "@/components/common/AppHeader";
import AppText from "@/components/ui/AppText";
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import RegisterSheet from "@/components/common/RegisterSheet";
import SecurityFooter from "@/components/common/SecurityFooter";
import AppFooter from "@/components/ui/AppFooter";
// import RegisterBottomSheet from "@/components/bottom-sheet/RegisterSheet";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import { ApiError, AuthSession, loginTrainee } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

const BYPASS_LOGIN = process.env.EXPO_PUBLIC_BYPASS_LOGIN === "true";

function createDevelopmentSession(phone: string): AuthSession {
  return {
    // This is intentionally not a real credential. Requests requiring a
    // server-issued token will remain protected by the backend.
    access_token: "development-login-bypass",
    token_type: "bearer",
    trainee: {
      id: 0,
      traineeUid: "development-trainee",
      name: "Test Trainee",
      phone: Number(phone) || 0,
      email: "test@example.com",
      gender: null,
      designation: "Test User",
      employee_id: "DEV-001",
      supervisorName: null,
      state: null,
      district: null,
      profilePhoto: null,
      status: "Active",
    },
  };
}

export default function Starter1() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);

  const handleContinue = async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("Enter your Company ID or Phone No");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (BYPASS_LOGIN) {
        setSession(createDevelopmentSession(trimmed));
        router.replace("/session");
        return;
      }

      const session = await loginTrainee(trimmed);
      setSession(session);
      router.push("/session");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        style="dark"
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <AppCard style={styles.headert}>
            <View style={styles.header}>
              <AuthHeader />
            </View>
            <View style={styles.body}>
              <AppInput
                label="Company ID / Phone No"
                placeholder="Enter Company ID or Phone No"
                value={phone}
                onChangeText={(value) => {
                  setPhone(value);
                  if (error) setError(null);
                }}
                keyboardType="phone-pad"
              />
              {error && (
                <AppText style={styles.error}>{error}</AppText>
              )}
              <View style={styles.actionsRow}>
                <AppButton
                  title="Continue"
                  onPress={handleContinue}
                  loading={loading}
                  buttonStyle={styles.continueButton}
                />
              </View>
              <Pressable onPress={openRegister}>
                <AppText
                  weight="500"
                  style={styles.register}
                >
                  New User ? Register
                </AppText>
              </Pressable>
            </View>
          </AppCard>
          <View style={styles.securityFooter}>
            <SecurityFooter />
          </View>
          <RegisterSheet
            visible={isRegisterOpen}
            onClose={closeRegister}
          />
          {/* <RegisterBottomSheet
          ref={bottomSheetRef}
        /> */}
        </View>
        <AppFooter
          items={[
            {
              key: "trainer-login",
              label: "Trainer Login",
              center: true,
              icon: ({ size, color }) => (
                <Ionicons
                  name="school-outline"
                  size={size}
                  color={color}
                />
              ),
              onPress: () => router.push("/trainer_login"),
            },
          ]}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },
  headert: {
    width: "95%",
  },
  header: {
    backgroundColor: Colors.mainColour1,
    paddingVertical: 35,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: "center",
  },
  body: {
    padding: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  continueButton: {
    flex: 1,
  },
  register: {
    marginTop: 15,
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: Fonts.bodySm,
  },
  error: {
    color: Colors.danger,
    fontSize: Fonts.bodySm,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  securityFooter: {
    marginTop: 42,
  },
});
