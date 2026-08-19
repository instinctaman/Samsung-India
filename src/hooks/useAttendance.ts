/**
 * useAttendance Hook
 * Manages attendance check-in lifecycle, API communication, error handling, and state.
 */

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, checkIn } from "@/api/attendance";
import { setSessionFlowState } from "@/api/session";

export type AttendanceStatus = "checking-in" | "done" | "error";

export function useAttendance(conferenceUid?: string) {
  const { token } = useAuth();
  const [status, setStatus] = useState<AttendanceStatus>("checking-in");
  const [markedOn, setMarkedOn] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const markAttendance = useCallback(async () => {
    if (!token || !conferenceUid) return;
    setStatus("checking-in");
    setError(null);
    try {
      const result = await checkIn(token, conferenceUid);
      setMarkedOn(result.markedOn);
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't mark your attendance.",
      );
      setStatus("error");
    }
  }, [token, conferenceUid]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!token || !conferenceUid) return;
      try {
        const result = await checkIn(token, conferenceUid);
        if (!ignore) {
          setMarkedOn(result.markedOn);
          setStatus("done");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Couldn't mark your attendance.",
          );
          setStatus("error");
        }
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [token, conferenceUid]);

  const confirmAttendanceRecorded = useCallback(() => {
    setSessionFlowState("ATTENDANCE_RECORDED");
  }, []);

  return {
    status,
    markedOn,
    error,
    retry: markAttendance,
    confirmAttendanceRecorded,
  };
}
