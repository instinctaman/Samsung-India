import { apiRequest } from "./client";

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
  modules: SessionModule[];
};

export function getCurrentSession(token: string) {
  return apiRequest<CurrentSession>("/sessions/current", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export { ApiError } from "./client";
