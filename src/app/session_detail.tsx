import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";
import { StatusBar } from "expo-status-bar";

import AccountCircle from "@/assets/images/svg/account_circle.svg";
import Alarm from "@/assets/images/svg/alarm.svg";
import GoogleDocs from "@/assets/images/svg/google-docs 1.svg";
import AppText from "@/components/ui/AppText";
import AppFooter from "@/components/ui/AppFooter";
import { Colors } from "@/theme/colors";
import { Fonts } from "@/theme/fonts";
import SessionHeader from "@/components/session/SessionHeader";
import SessionTimeline from "@/components/session/SessionTimeline";
import { SessionItem } from "@/components/session/TimelineItem";
import SessionNotice from "@/components/session/SessionNotice";
import WaitingCard from "@/components/session/WaitingCard";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, CurrentSession, SessionModuleKey, getCurrentSession } from "@/api/session";

const MODULE_PRESENTATION: Record<SessionModuleKey, { icon: ComponentType<SvgProps>; iconColor: string }> = {
  ATTENDANCE: { icon: AccountCircle, iconColor: Colors.success },
  STANDARD_TEST: { icon: GoogleDocs, iconColor: Colors.mainColour1 },
  LIVE_QUIZ: { icon: Alarm, iconColor: Colors.mainColour1 },
  SURVEY: { icon: GoogleDocs, iconColor: Colors.mainColour1 },
};

export default function SessionDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { trainee, token } = useAuth();

  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentSession(token);
      setSession(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load your session.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Refetch every time this screen regains focus (e.g. after marking
  // attendance or submitting the standard test) so the timeline reflects
  // what actually happened, instead of trusting stale nav params.
  useFocusEffect(
    useCallback(() => {
      loadSession();
    }, [loadSession])
  );

  const sessionItems: SessionItem[] = (session?.modules ?? []).map((module) => ({
    key: module.key,
    time: module.time ?? "--:--",
    endTime: module.endTime ?? "",
    duration: module.duration ?? "",
    type: module.name,
    isLive: module.isLive,
    isCompleted: module.isCompleted,
    completedAt: module.completedAt,
    score: module.score,
    ...MODULE_PRESENTATION[module.key],
  }));

  const handleMarkAttendance = () => {
    if (!session) return;
    const attendanceModule = session.modules.find((module) => module.key === "ATTENDANCE");
    router.push({
      pathname: "/attendance",
      params: {
        conferenceUid: session.conferenceUid,
        title: session.title,
        location: session.location ?? "",
        time: attendanceModule?.time ?? "",
        endTime: attendanceModule?.endTime ?? "",
      },
    });
  };

  const handleEnterPostTest = () => {
    const standardTest = session?.modules.find((module) => module.key === "STANDARD_TEST");
    if (!session || !standardTest?.assessmentSuiteUid) return;
    router.push({
      pathname: "/post_test",
      params: { conferenceUid: session.conferenceUid, suiteUid: standardTest.assessmentSuiteUid },
    });
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={[styles.statusBarBackground, { height: insets.top }]} />
        <StatusBar style="light" animated />
        <SessionHeader
          onBack={() => router.back()}
          onLogout={() => console.log("Logout")}
          userName={trainee?.name ?? "Trainee"}
          confirmationStatus={session?.confirmationStatus ?? "Not Confirmed"}
          sessionType={session?.sessionType ?? ""}
          title={session?.title ?? "Training Session"}
          date={session?.date ?? ""}
          location={session?.location ?? ""}
        />

        <View style={styles.body}>
          {loading && !session ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.mainColour1} />
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <AppText style={styles.errorText}>{error}</AppText>
              <Pressable style={styles.retryButton} onPress={loadSession}>
                <AppText color={Colors.white}>Retry</AppText>
              </Pressable>
            </View>
          ) : session && !session.started ? (
            <View style={styles.centered}>
              <WaitingCard
                title="Session hasn't started yet"
                subtitle={session.startsAt ? `Starts ${session.startsAt}` : "Check back soon"}
              />
            </View>
          ) : (
            <SessionTimeline
              sessions={sessionItems}
              onMarkAttendance={handleMarkAttendance}
              onEnterQuiz={() => router.push("/wait")}
              onEnterPostTest={handleEnterPostTest}
            />
          )}
          <SessionNotice />
        </View>
        <AppFooter activeTab="plan" />
      </SafeAreaView >
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  statusBarBackground: { position: "absolute", left: 0, right: 0, backgroundColor: Colors.mainColour1 },
  body: {
    flex: 1,
    minHeight: 0,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: Fonts.body,
    color: Colors.gray600,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.mainColour1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
