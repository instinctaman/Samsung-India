export type SessionModuleKey = "ATTENDANCE" | "STANDARD_TEST" | "LIVE_QUIZ" | "SURVEY";

// Field names mirror the /sessions/current response built from the
// `conference` table in the legacy database dump.
export type SessionModule = {
  key: SessionModuleKey;
  name: string;
  time: string | null;
  endTime: string | null;
  duration: string | null;
  isLive: boolean;
  isCompleted: boolean;
  isMissed: boolean;
  completedAt: string | null;
  score: string | null;
  ranDuration?: string | null;
  assessmentSuiteUid: string | null;
};


export type SessionFlowState =
  | "JOINED"
  | "SECURE_CHECKIN"
  | "LOCATION_VERIFIED"
  | "CAMERA_VERIFIED"
  | "MARK_ATTENDANCE"
  | "ACCESS_GRANTED"
  | "ATTENDANCE_RECORDED";

export type AttendanceState = SessionFlowState;

export type CurrentSession = {
  conferenceUid: string;
  title: string;
  sessionType: string | null;
  date: string | null;
  location: string | null;
  trainerName: string | null;
  confirmationStatus: string;
  started: boolean;
  startsAt: string | null;
  attendanceGeoFencing: boolean;
  securityCheckInCompleted?: boolean;
  attendanceState?: AttendanceState;
  flowState?: SessionFlowState;
  modules: SessionModule[];
};

export type SessionHistoryItem = {
  conferenceUid: string;
  title: string;
  date: string | null;
  trainerName: string | null;
  attendanceStatus: string | null;
  score: string | null;
  passed: boolean | null;
};

// Demo implementations — no network calls.
export {
  getCurrentSession,
  getSessionHistory,
  setSecurityCheckInCompleted,
  getAttendanceState,
  setAttendanceState,
  getSessionFlowState,
  setSessionFlowState,
  resetSessionFlowState,
  isAttendanceRecorded,
} from "@/api/mockService";
export { ApiError } from "@/api/client";

