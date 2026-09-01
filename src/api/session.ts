import { USE_MOCK_DATA } from "@/config/dataSource";
import { apiRequest } from "./client";
import * as mock from "./mockService";

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

export function getCurrentSession(token: string) {
  if (USE_MOCK_DATA) return mock.getCurrentSession(token);
  return apiRequest<CurrentSession>("/sessions/current", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// The training behind a shared QR code (samsungindia://join/<code>).
export type SessionJoinInfo = {
  conferenceUid: string;
  title: string;
  sessionType: string | null;
  date: string | null;
  location: string | null;
  trainerName: string | null;
  started: boolean;
  startsAt: string | null;
};

/** Public preview - no auth. Used by the join screen before login. */
export function getSessionJoinInfo(code: string) {
  return apiRequest<SessionJoinInfo>(`/sessions/join/${encodeURIComponent(code)}`);
}

/** Binds the logged-in trainee to the scanned training (and auto-approves
 *  a trainee who arrived via a trainer-shared QR). */
export function joinSession(code: string, token: string) {
  return apiRequest<SessionJoinInfo>(`/sessions/join/${encodeURIComponent(code)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Live Quiz (FFF): trainee view ----------------------------------------

export type LiveQuizState = "IDLE" | "WAITING" | "QUESTION_LIVE" | "LEADERBOARD" | "FINISHED" | string;

export type LiveQuizQuestion = {
  id: number;
  text: string;
  options: { id: string; text: string }[];
};

export type LiveQuizView = {
  state: LiveQuizState;
  conferenceUid: string;
  suiteUid: string | null;
  question: LiveQuizQuestion | null;
  timerEndsAt: number | null;
  alreadyAnswered: boolean;
};

export function getLiveQuizView(token: string, conferenceUid: string) {
  return apiRequest<LiveQuizView>(
    `/sessions/live-quiz?conferenceUid=${encodeURIComponent(conferenceUid)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export function submitLiveAnswer(
  token: string,
  conferenceUid: string,
  questionId: number,
  selectedOption: string | null,
) {
  return apiRequest<{ accepted: boolean }>("/sessions/live-quiz/answer", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ conferenceUid, questionId, selectedOption }),
  });
}

export type SessionHistoryItem = {
  conferenceUid: string;
  title: string;
  date: string | null;
  trainerName: string | null;
  attendanceStatus: string | null;
  score: string | null;
  passed: boolean | null;
};

export function getSessionHistory(token: string) {
  if (USE_MOCK_DATA) return mock.getSessionHistory(token);
  return apiRequest<SessionHistoryItem[]>("/sessions/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Pure client-side navigation state (not backed by any endpoint, real or
// mock) - always the same implementation regardless of USE_MOCK_DATA.
export {
  setSecurityCheckInCompleted,
  getAttendanceState,
  setAttendanceState,
  getSessionFlowState,
  setSessionFlowState,
  resetSessionFlowState,
  isAttendanceRecorded,
} from "@/api/mockService";
export { ApiError } from "@/api/client";

