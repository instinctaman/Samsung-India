import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  useFonts,
} from "@expo-google-fonts/poppins";
import { DefaultTheme, Stack, ThemeProvider, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync("#EEF4FF");

const TRAINER_ROUTES = [
  "/admin_dashboard",
  "/trainer_dashboard",
  "/assessment_builder",
  "/add_training",
  "/pending_trainings",
  "/training_list",
  "/sessions",
  "/session_dashboard",
];

export default function RootLayout() {
  const pathname = usePathname();
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Light": Poppins_300Light,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-ExtraBold": Poppins_800ExtraBold,
    "Poppins-Black": Poppins_900Black,
    Poppins: Poppins_400Regular,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Globally blur active element on route changes to eliminate aria-hidden accessibility warnings on React Native Web
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      (document.activeElement as HTMLElement)?.blur?.();
    }
  }, [pathname]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const isWeb = Platform.OS === "web";
  const isTrainerRoute = TRAINER_ROUTES.some((route) => pathname?.startsWith(route));

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <AnimatedSplashOverlay />
        <View
          style={[
            styles.root,
            isWeb && styles.webRoot,
          ]}
        >
          <View
            style={[
              styles.appContainer,
              isWeb && (isTrainerRoute ? styles.webTrainerContainer : styles.webMobileContainer),
            ]}
          >
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "transparent" } }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="trainer_login" />
              <Stack.Screen name="trainer_dashboard" />
              <Stack.Screen name="admin_dashboard" />
              <Stack.Screen name="assessment_builder" />
              <Stack.Screen name="add_training" />
              <Stack.Screen name="pending_trainings" />
              <Stack.Screen name="training_list" />
              <Stack.Screen name="sessions" />
              <Stack.Screen name="session_dashboard" />
              <Stack.Screen name="session" />
              <Stack.Screen name="session_detail" />
              <Stack.Screen name="secure_checkin" />
              <Stack.Screen name="attendance" />
              <Stack.Screen name="wait" />
              <Stack.Screen name="quiz" />
              <Stack.Screen name="quiz_leaderboard" />
              <Stack.Screen name="post_test" />
              <Stack.Screen name="post_test_proctoring" />
              <Stack.Screen name="survey" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="explore" />
            </Stack>
          </View>
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#EEF4FF",
  },
  webRoot: {
    backgroundColor: "#E2E8F0",
    minHeight: "100%",
  },
  appContainer: {
    flex: 1,
    width: "100%",
  },
  webMobileContainer: {
    maxWidth: 480,
    width: "100%",
    marginHorizontal: "auto",
    backgroundColor: "#EEF4FF",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.08)",
  },
  webTrainerContainer: {
    maxWidth: 1024,
    width: "100%",
    marginHorizontal: "auto",
    backgroundColor: "#F9FAFB",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.08)",
  },
});
