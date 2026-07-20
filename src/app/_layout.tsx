import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="session" />
          <Stack.Screen name="session_detail" />
          <Stack.Screen name="attendance" />
          <Stack.Screen name="wait" />
          <Stack.Screen name="quiz" />
          <Stack.Screen name="post_test" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="explore" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
