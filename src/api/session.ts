import { apiRequest } from "./client";
import { USE_MOCK_DATA } from "./mockConfig";
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
  assessmentSuiteUid: string | null;
};

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
  modules: SessionModule[];
};

export function getCurrentSession(token: string) {
  if (USE_MOCK_DATA) return mock.getCurrentSession(token);
  return apiRequest<CurrentSession>("/sessions/current", {
    headers: { Authorization: `Bearer ${token}` },
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

export { ApiError } from "./client";
