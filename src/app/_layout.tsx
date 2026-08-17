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
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider } from "@/hooks/useAuth";

SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync("#EEF4FF");

export default function RootLayout() {
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
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
      </ThemeProvider>
    </AuthProvider>
  );
}
