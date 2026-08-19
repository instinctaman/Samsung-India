import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import {
  ApiError,
  CurrentSession,
  SessionModuleKey,
  getCurrentSession,
} from "@/api/session";
import { useAuth } from "@/hooks/useAuth";

export type TraineeTab = "rank" | "home" | "profile";

export interface SessionActivityData {
  id: string;
  key: SessionModuleKey;
  startTime: string;
  endTime: string;
  duration: string;
  type: string;
  title: string;
  isLive: boolean;
  isCompleted: boolean;
  isMissed: boolean;
  completedAt: string | null;
  score: string | null;
  ranDuration?: string | null;
  geoFencing?: boolean;
}

export function useTraineeHome() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    attendance?: string;
    quiz?: string;
    score?: string;
    duration?: string;
  }>();
  const { trainee, token, logout } = useAuth();

  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [notAssigned, setNotAssigned] = useState(false);
  const [activeTab, setActiveTab] = useState<TraineeTab>("home");

  const loadSession = useCallback(
    async (mode: "load" | "refresh" | "silent" = "load") => {
      if (!token) return;
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "load") setLoading(true);
      if (mode !== "silent") setError(null);

      try {
        const data = await getCurrentSession(token);
        if (params.quiz === "completed") {
          data.modules = data.modules.map((m) => {
            if (m.key === "LIVE_QUIZ") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                score: params.score ?? m.score ?? "9/15",
                completedAt: "Completed successfully",
                ranDuration: params.duration ?? m.ranDuration ?? "Ran : 1h 55m",
              };
            }
            if (m.key === "STANDARD_TEST") {
              return {
                ...m,
                isLive: true,
              };
            }
            return m;
          });
        }
        setSession(data);
        setNotAssigned(false);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setSession(null);
          setNotAssigned(true);
        } else if (mode !== "silent") {
          setError(
            err instanceof ApiError
              ? err.message
              : "Couldn't load your session.",
          );
        }
      } finally {
        if (mode === "refresh") setRefreshing(false);
        else if (mode === "load") setLoading(false);
      }
    },
    [token],
  );

  useFocusEffect(
    useCallback(() => {
      setActiveTab("home");
      loadSession();
    }, [loadSession]),
  );

  const allModulesDone =
    session != null &&
    session.modules.length > 0 &&
    session.modules.every((module) => module.isCompleted);
  const shouldPoll = notAssigned || !allModulesDone;

  useEffect(() => {
    if (!shouldPoll) return;
    const interval = setInterval(() => loadSession("silent"), 10000);
    return () => clearInterval(interval);
  }, [shouldPoll, loadSession]);

  const activities: SessionActivityData[] = (session?.modules ?? []).map(
    (module) => ({
      id: module.key,
      key: module.key,
      startTime: module.time ?? "09:00",
      endTime: module.endTime ?? "10:00",
      duration: module.duration ?? (module.key === "ATTENDANCE" ? "1h" : "2h"),
      type: module.name,
      title: "Session Activity",
      isLive: module.isLive,
      isCompleted: module.isCompleted,
      isMissed: module.isMissed,
      completedAt: module.completedAt,
      score: module.score,
      ranDuration: module.ranDuration,
      geoFencing:
        module.key === "ATTENDANCE" ? session?.attendanceGeoFencing : undefined,
    }),
  );

  const handleMarkAttendance = () => {
    if (!session) return;
    const attendanceModule = session.modules.find(
      (module) => module.key === "ATTENDANCE",
    );
    router.push({
      pathname: session.attendanceGeoFencing
        ? "/secure_checkin"
        : "/attendance",
      params: {
        conferenceUid: session.conferenceUid,
        title: session.title,
        location: session.location ?? "",
        time: attendanceModule?.time ?? "",
        endTime: attendanceModule?.endTime ?? "",
      },
    });
  };

  const handleEnterLiveQuiz = () => {
    const liveQuiz = session?.modules.find(
      (module) => module.key === "LIVE_QUIZ",
    );
    router.push({
      pathname: "/wait",
      params: {
        conferenceUid: session?.conferenceUid ?? "",
        suiteUid: liveQuiz?.assessmentSuiteUid ?? "",
      },
    });
  };

  const handleEnterPostTest = () => {
    const standardTest = session?.modules.find(
      (module) => module.key === "STANDARD_TEST",
    );
    if (!session || !standardTest?.assessmentSuiteUid) return;
    router.push({
      pathname: "/post_test_proctoring",
      params: {
        conferenceUid: session.conferenceUid,
        suiteUid: standardTest.assessmentSuiteUid,
      },
    });
  };

  const handleEnterSurvey = () => {
    const survey = session?.modules.find((module) => module.key === "SURVEY");
    if (!session || !survey?.assessmentSuiteUid) return;
    router.push({
      pathname: "/survey",
      params: {
        conferenceUid: session.conferenceUid,
        suiteUid: survey.assessmentSuiteUid,
      },
    });
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const handleTabSelect = (tab: TraineeTab) => {
    setActiveTab(tab);
    if (tab === "rank") {
      router.push("/quiz_leaderboard");
    } else if (tab === "profile") {
      router.push("/profile");
    } else if (tab === "home") {
      loadSession("refresh");
    }
  };

  return {
    trainee,
    token,
    session,
    activities,
    loading,
    refreshing,
    error,
    notAssigned,
    activeTab,
    historyVisible,
    setHistoryVisible,
    loadSession,
    handleMarkAttendance,
    handleEnterLiveQuiz,
    handleEnterPostTest,
    handleEnterSurvey,
    handleLogout,
    handleTabSelect,
    router,
  };
}
