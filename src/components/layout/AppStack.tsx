import { Stack } from "expo-router";

export function AppStack() {
  return (
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
      <Stack.Screen name="survey" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
