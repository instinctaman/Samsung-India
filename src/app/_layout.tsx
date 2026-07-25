import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

// Android no longer lets expo-status-bar paint a background color behind
// the status bar (edge-to-edge is mandatory as of SDK 57) - the status bar
// just shows whatever the root view's own background is. Some devices
// don't pick that up from our screens' own styling, leaving the OS default
// (black) behind the status bar instead. Setting it here, once, at the
// native root-view level keeps it consistent across devices.
SystemUI.setBackgroundColorAsync('#EEF4FF');

export default function RootLayout() {
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
          <Stack.Screen name="session_dashboard" />
          <Stack.Screen name="session" />
          <Stack.Screen name="session_detail" />
          <Stack.Screen name="attendance" />
          <Stack.Screen name="wait" />
          <Stack.Screen name="quiz" />
          <Stack.Screen name="quiz_leaderboard" />
          <Stack.Screen name="post_test" />
          <Stack.Screen name="survey" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="explore" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
