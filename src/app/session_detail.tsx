import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
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
import Calendar from "@/assets/images/svg/calender.svg";
import Calendar1 from "@/assets/images/svg/calender2.svg";
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
import RecentSessionsModal from "@/components/session/RecentSessionsModal";
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [notAssigned, setNotAssigned] = useState(false);

  const loadSession = useCallback(async (mode: "load" | "refresh" | "silent" = "load") => {
    if (!token) return;
    if (mode === "refresh") setRefreshing(true);
    else if (mode === "load") setLoading(true);
    if (mode !== "silent") setError(null);
    try {
      const data = await getCurrentSession(token);
      setSession(data);
      setNotAssigned(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setSession(null);
        setNotAssigned(true);
      } else if (mode !== "silent") {
        // A silent background poll shouldn't flash an error banner over a
        // working screen just because of a transient network hiccup.
        setError(err instanceof ApiError ? err.message : "Couldn't load your session.");
      }
    } finally {
      if (mode === "refresh") setRefreshing(false);
      else if (mode === "load") setLoading(false);
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

  // Poll quietly in the background for anything that can change on its own -
  // the trainer starting the session, a module's configured start time
  // arriving, an admin approving it - so the trainee never has to
  // pull-to-refresh to see it. Stops once every module is done.
  const allModulesDone = session != null && session.modules.length > 0 && session.modules.every((module) => module.isCompleted);
  const shouldPoll = notAssigned || !allModulesDone;
  useEffect(() => {
    if (!shouldPoll) return;
    const interval = setInterval(() => loadSession("silent"), 10000);
    return () => clearInterval(interval);
  }, [shouldPoll, loadSession]);

  const sessionItems: SessionItem[] = (session?.modules ?? []).map((module) => ({
    key: module.key,
    time: module.time ?? "--:--",
    endTime: module.endTime ?? "",
    duration: module.duration ?? "",
    type: module.name,
    isLive: module.isLive,
    isCompleted: module.isCompleted,
    isMissed: module.isMissed,
    completedAt: module.completedAt,
    score: module.score,
    geoFencing: module.key === "ATTENDANCE" ? session?.attendanceGeoFencing : undefined,
    ...MODULE_PRESENTATION[module.key],
  }));

  const handleMarkAttendance = () => {
    if (!session) return;
    const attendanceModule = session.modules.find((module) => module.key === "ATTENDANCE");
    router.push({
      pathname: session.attendanceGeoFencing ? "/secure_checkin" : "/attendance",
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

  const handleEnterSurvey = () => {
    const survey = session?.modules.find((module) => module.key === "SURVEY");
    if (!session || !survey?.assessmentSuiteUid) return;
    router.push({
      pathname: "/survey",
      params: { conferenceUid: session.conferenceUid, suiteUid: survey.assessmentSuiteUid },
    });
  };

  // The trainer picking a question live for trainees to answer in real
  // time is a future iteration - for now the quiz keeps its own flow
  // (per-question timer, assessment map, results) but fetches real
  // questions and submits for real, same as everything else.
  const handleEnterLiveQuiz = () => {
    const liveQuiz = session?.modules.find((module) => module.key === "LIVE_QUIZ");
    if (!session || !liveQuiz?.assessmentSuiteUid) return;
    router.push({
      pathname: "/quiz",
      params: { conferenceUid: session.conferenceUid, suiteUid: liveQuiz.assessmentSuiteUid },
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
          onHistoryPress={() => setHistoryVisible(true)}
          userName={trainee?.name ?? "Trainee"}
          gender={trainee?.gender}
          profilePhoto={trainee?.profilePhoto}
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
          ) : notAssigned ? (
            <View style={styles.centered}>
              <WaitingCard
                title="No Session Assigned"
                subtitle="No session is assigned yet"
              />
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <AppText style={styles.errorText}>{error}</AppText>
              <Pressable style={styles.retryButton} onPress={() => loadSession()}>
                <AppText color={Colors.white}>Retry</AppText>
              </Pressable>
            </View>
          ) : session && !session.started ? (
            <View style={styles.centered}>
              <WaitingCard
                title="Session hasn't started yet"
                subtitle="Trainer will unlock soon as it's available"
              />
            </View>
          ) : (
            <SessionTimeline
              sessions={sessionItems}
              onMarkAttendance={handleMarkAttendance}
              onEnterQuiz={handleEnterLiveQuiz}
              onEnterPostTest={handleEnterPostTest}
              onEnterSurvey={handleEnterSurvey}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => loadSession("refresh")} colors={[Colors.mainColour1]} tintColor={Colors.mainColour1} />
              }
            />
          )}
          <SessionNotice />
        </View>
        <AppFooter
          items={[
            {
              key: "plan",
              label: "Plan",
              active: true,
              icon: ({ size, color }) => <Calendar1 width={size} height={size} color={color} />,
              onPress: () => router.replace("/session_detail"),
            },
            {
              key: "calendar",
              center: true,
              icon: ({ size }) => <Calendar width={size} height={size} />,
              onPress: () => router.replace("/session_detail"),
            },
            {
              key: "profile",
              label: "Profile",
              icon: ({ size, color }) => <AccountCircle width={size} height={size} color={color} />,
              onPress: () => router.push("/profile"),
            },
          ]}
        />
      </SafeAreaView >
      <RecentSessionsModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        token={token}
      />
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
