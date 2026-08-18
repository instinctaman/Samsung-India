import { USE_MOCK_DATA } from "@/config/dataSource";
import { apiRequest } from "./client";
import * as mock from "./mockService";

export type AttendanceListItem = {
  traineeUid: string;
  name: string;
  trainerName: string | null;
  date: string | null;
  marked: boolean;
};

export function fetchAttendanceList(token: string) {
  if (USE_MOCK_DATA) return mock.fetchAttendanceList(token);
  return apiRequest<AttendanceListItem[]>("/admin/attendance", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export { ApiError } from "./client";
