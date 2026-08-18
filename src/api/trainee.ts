import { USE_MOCK_DATA } from "@/config/dataSource";
import type { NewTraineeRecord } from "@/data/mockData";
import { apiRequest } from "./client";
import * as mock from "./mockService";

export type NewTraineeInput = Omit<NewTraineeRecord, "registeredAt" | "approvalStatus">;
export type TraineeListItem = NewTraineeRecord;

export function registerNewTrainee(token: string, payload: NewTraineeInput) {
  if (USE_MOCK_DATA) return mock.registerNewTrainee(token, payload);
  return apiRequest<NewTraineeRecord>("/admin/trainees", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function fetchTraineeList(token: string) {
  if (USE_MOCK_DATA) return mock.fetchTraineeList(token);
  return apiRequest<TraineeListItem[]>("/admin/trainees", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export { ApiError } from "./client";
