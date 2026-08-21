import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import {
  ApiError,
  AttendanceState,
  CurrentSession,
  SessionFlowState,
  SessionModuleKey,
  getCurrentSession,
  getSessionFlowState,
  isAttendanceRecorded,
  setSessionFlowState,
} from "@/api/session";
import { isSessionLocked } from "@/components/proctoring/violations";
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
  /** True when a Post Test was terminated due to security violation */
  isLocked?: boolean;
  completedAt: string | null;
  score: string | null;
  ranDuration?: string | null;
  geoFencing?: boolean;
  securityCheckInCompleted?: boolean;
  attendanceState?: AttendanceState;
}

export function useTraineeHome() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    flow?: SessionFlowState;
    attendance?: string;
    checkIn?: string;
    quiz?: string;
    postTest?: string;
    survey?: string;
    score?: string;
    duration?: string;
    violation?: string;
    violationType?: string;
  }>();
  const { trainee, token, logout } = useAuth();

  const [session, setSession] = useState<CurrentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [violationLockedVisible, setViolationLockedVisible] = useState(
    () => params.violation === "locked" || params.postTest === "security_locked",
  );
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
        const hasAttendanceRecorded =
          isAttendanceRecorded() ||
          params.flow === "ATTENDANCE_RECORDED" ||
          params.attendance === "completed" ||
          params.quiz === "completed" ||
          params.postTest === "completed" ||
          params.postTest === "security_locked" ||
          params.survey === "completed";

        if (hasAttendanceRecorded) {
          setSessionFlowState("ATTENDANCE_RECORDED");
          data.flowState = "ATTENDANCE_RECORDED";
          data.modules = data.modules.map((m) => {
            if (m.key === "ATTENDANCE") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                completedAt: m.completedAt ?? "10:25",
                ranDuration: m.ranDuration ?? "Ran : 45m 3s",
              };
            }
            if (m.key === "LIVE_QUIZ" && !m.isCompleted && !params.quiz && !params.postTest && !params.survey) {
              return {
                ...m,
                isLive: true,
              };
            }
            return m;
          });
        }

        if (params.survey === "completed") {
          data.modules = data.modules.map((m) => {
            if (m.key === "ATTENDANCE") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                completedAt: m.completedAt ?? "10:25",
                ranDuration: m.ranDuration ?? "Ran : 45m 3s",
              };
            }
            if (m.key === "LIVE_QUIZ") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                score: m.score ?? "9/15",
                completedAt: "Completed successfully",
                ranDuration: m.ranDuration ?? "Ran : 1h 55m",
              };
            }
            if (m.key === "STANDARD_TEST") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                score: m.score ?? "12/15",
                completedAt: "Completed successfully",
                ranDuration: m.ranDuration ?? "Ran : 1h 50m",
              };
            }
            if (m.key === "SURVEY") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                completedAt: "Completed successfully",
                ranDuration: "Ran : 25m",
              };
            }
            return m;
          });
        } else if (params.postTest === "security_locked") {
          // Post Test was terminated due to security violation — NOT completed
          // Quiz session activity remains completed
          // Survey stays Upcoming
          data.modules = data.modules.map((m) => {
            if (m.key === "ATTENDANCE") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                completedAt: m.completedAt ?? "10:25",
                ranDuration: m.ranDuration ?? "Ran : 45m 3s",
              };
            }
            if (m.key === "LIVE_QUIZ") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                score: m.score ?? "9/15",
                completedAt: m.completedAt ?? "Completed successfully",
                ranDuration: m.ranDuration ?? "Ran : 1h 55m",
              };
            }
            if (m.key === "STANDARD_TEST") {
              return {
                ...m,
                isCompleted: false,
                isLive: false,
                isLocked: true,
                completedAt: "Security Violation",
                score: null,
              };
            }
            // Survey remains Upcoming
            return m;
          });
        } else if (params.postTest === "completed") {
          data.modules = data.modules.map((m) => {
            if (m.key === "ATTENDANCE") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                completedAt: m.completedAt ?? "10:25",
                ranDuration: m.ranDuration ?? "Ran : 45m 3s",
              };
            }
            if (m.key === "LIVE_QUIZ") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                score: m.score ?? "9/15",
                completedAt: "Completed successfully",
                ranDuration: m.ranDuration ?? "Ran : 1h 55m",
              };
            }
            if (m.key === "STANDARD_TEST") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                score: params.score ?? m.score ?? "12/15",
                completedAt: "Completed successfully",
                ranDuration: params.duration ?? m.ranDuration ?? "Ran : 1h 50m",
              };
            }
            if (m.key === "SURVEY") {
              return {
                ...m,
                isLive: true,
                isCompleted: false,
              };
            }
            return m;
          });
        } else if (params.quiz === "completed") {
          data.modules = data.modules.map((m) => {
            if (m.key === "ATTENDANCE") {
              return {
                ...m,
                isCompleted: true,
                isLive: false,
                completedAt: m.completedAt ?? "10:25",
                ranDuration: m.ranDuration ?? "Ran : 45m 3s",
              };
            }
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
        } else if (
          params.flow === "CAMERA_VERIFIED" ||
          params.checkIn === "verified"
        ) {
          if (!hasAttendanceRecorded) {
            setSessionFlowState("CAMERA_VERIFIED");
            data.flowState = "CAMERA_VERIFIED";
          }
        } else if (params.flow === "SECURE_CHECKIN") {
          if (!hasAttendanceRecorded) {
            setSessionFlowState("SECURE_CHECKIN");
            data.flowState = "SECURE_CHECKIN";
          }
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
    [
      token,
      params.attendance,
      params.checkIn,
      params.duration,
      params.flow,
      params.postTest,
      params.quiz,
      params.score,
      params.survey,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      setActiveTab("home");
      if (params.violation === "locked" || params.postTest === "security_locked") {
        setViolationLockedVisible(true);
      }
      loadSession();
    }, [loadSession, params.violation, params.postTest]),
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

  const currentFlow: SessionFlowState =
    isAttendanceRecorded() ||
    session?.flowState === "ATTENDANCE_RECORDED" ||
    getSessionFlowState() === "ATTENDANCE_RECORDED" ||
    params.flow === "ATTENDANCE_RECORDED" ||
    params.attendance === "completed" ||
    params.quiz === "completed" ||
    params.postTest === "completed" ||
    params.postTest === "security_locked" ||
    params.survey === "completed"
      ? "ATTENDANCE_RECORDED"
      : params.flow === "CAMERA_VERIFIED" ||
        params.checkIn === "verified" ||
        session?.flowState === "CAMERA_VERIFIED"
      ? "CAMERA_VERIFIED"
      : session?.flowState || getSessionFlowState() || "SECURE_CHECKIN";

  const activities: SessionActivityData[] = (session?.modules ?? []).map(
    (module) => {
      const isAttendance = module.key === "ATTENDANCE";
      const isAttendanceCompleted =
        isAttendance && currentFlow === "ATTENDANCE_RECORDED";

      const isLiveModule = isAttendance
        ? currentFlow !== "ATTENDANCE_RECORDED"
        : currentFlow === "ATTENDANCE_RECORDED"
          ? module.isLive ||
            (module.key === "LIVE_QUIZ" && !module.isCompleted)
          : false;

      return {
        id: module.key,
        key: module.key,
        startTime: module.time ?? "09:00",
        endTime: module.endTime ?? "10:00",
        duration: module.duration ?? (isAttendance ? "1h" : "2h"),
        type: module.name,
        title: "Session Activity",
        isLive: isLiveModule,
        isCompleted: isAttendance ? isAttendanceCompleted : module.isCompleted,
        isMissed: module.isMissed,
        isLocked: (module as { isLocked?: boolean }).isLocked ?? false,
        completedAt: isAttendanceCompleted
          ? module.completedAt ?? "10:25"
          : module.completedAt,
        score: module.score,
        ranDuration: isAttendanceCompleted
          ? module.ranDuration ?? "Ran : 45m 3s"
          : module.ranDuration,
        geoFencing: isAttendance ? session?.attendanceGeoFencing : undefined,
        securityCheckInCompleted: isAttendance
          ? currentFlow === "CAMERA_VERIFIED" ||
            currentFlow === "MARK_ATTENDANCE" ||
            currentFlow === "ACCESS_GRANTED" ||
            currentFlow === "ATTENDANCE_RECORDED"
          : undefined,
        attendanceState: isAttendance ? currentFlow : undefined,
      };
    },
  );

  const blurActiveElement = () => {
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement)?.blur?.();
    }
  };

  const handleMarkAttendance = () => {
    if (!session) return;
    blurActiveElement();
    const attendanceModule = session.modules.find(
      (module) => module.key === "ATTENDANCE",
    );

    if (currentFlow === "ATTENDANCE_RECORDED") {
      return;
    }

    if (currentFlow === "CAMERA_VERIFIED") {
      // Step 5: Mark Attendance button opens Attendance verification
      setSessionFlowState("MARK_ATTENDANCE");
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
    } else {
      // Step 2 -> Step 3: Secure Check-In button opens Location Verification
      setSessionFlowState("LOCATION_VERIFIED");
      router.push({
        pathname: "/secure_checkin",
        params: {
          conferenceUid: session.conferenceUid,
          title: session.title,
          location: session.location ?? "",
          time: attendanceModule?.time ?? "",
          endTime: attendanceModule?.endTime ?? "",
          mode: "entry",
        },
      });
    }
  };

  const handleEnterLiveQuiz = () => {
    blurActiveElement();
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
    blurActiveElement();
    const standardTest = session?.modules.find(
      (module) => module.key === "STANDARD_TEST",
    );
    if (!session || !standardTest?.assessmentSuiteUid) return;

    const sessionKey = `${session.conferenceUid}_${standardTest.assessmentSuiteUid}`;
    if (
      isSessionLocked(sessionKey) ||
      isSessionLocked(session.conferenceUid) ||
      params.postTest === "security_locked"
    ) {
      setViolationLockedVisible(true);
      return;
    }

    router.push({
      pathname: "/post_test",
      params: {
        conferenceUid: session.conferenceUid,
        suiteUid: standardTest.assessmentSuiteUid,
      },
    });
  };

  const handleEnterSurvey = () => {
    blurActiveElement();
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
    violationLockedVisible,
    setViolationLockedVisible,
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
