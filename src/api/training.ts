import { USE_MOCK_DATA } from "@/config/dataSource";
import { apiRequest } from "./client";
import * as mock from "./mockService";
// All types are preserved — they are used extensively across screens.

export type ModuleConfig = {
  category?: string;
  assessmentSuiteUid?: string;
  questionCount?: number;
  startTime?: string;
  endTime?: string;
  checkIn: boolean;
  unlockCondition?: string;
};

export type AssessmentSuiteOut = {
  assessmentSuiteUid: string;
  category: string;
  name: string;
  noOfQuestion: number;
};

export type AttendanceConfig = {
  checkInOpens?: string;
  checkOutCloses?: string;
  geoFencing: boolean;
};

export type SessionFlowConfig = {
  attendance?: AttendanceConfig;
  standardTest?: ModuleConfig;
  liveQuiz?: ModuleConfig;
  survey?: ModuleConfig;
};

export type TrainingCreatePayload = {
  zone?: string;
  region?: string;
  company?: string;
  requestedBy?: string;

  trainerEmployeeId?: string;
  trainerName?: string;

  state?: string;
  district?: string;
  venue?: string;

  isResidential: boolean;
  conferenceDate: string;
  conferenceTime: string;
  trainingHub?: string;
  audience?: string;
  sessionType?: string;
  trainingType?: string;
  batchSize?: string;

  sessionFlow?: SessionFlowConfig;
  checklist?: string[];
};

export type TrainingOut = {
  conferenceUid: string;
  conferenceStatus: string;
  status: string;
};

export type TrainingAgendaItem = {
  conferenceUid: string;
  title: string;
  trainerName: string | null;
  conferenceDate: string | null;
  conferenceTime: string | null;
  conferenceStatus: string;
  approvalStatus: string;
  location: string | null;
  batchSize: string | null;
  trainingType: string | null;
  state: string | null;
  trainingHub: string | null;
  totalPax: number | null;
  hoid: string | null;
  venueName: string | null;
  district: string | null;
  updatedBy: string | null;
  updationOn: string | null;
  timestamp: string | null;
};

export type AudienceBreakdown = {
  total: number;
  present: number;
};

export type AssessmentSummary = {
  pass: number;
  fail: number;
  totalAttempts: number;
};

export type TopPerformer = {
  traineeUid: string;
  name: string;
  percentage: number;
};

export type TraineeRow = {
  traineeUid: string;
  name: string;
  phone: number | null;
  status: string;
  markedOn: string | null;
  checkOutTime: string | null;
  score: string | null;
  profilePhoto: string | null;
};

export type ExecutionFlowStatus = "Pending" | "Running" | "Completed";

export type ExecutionFlowItem = {
  moduleKey: string;
  label: string;
  status: ExecutionFlowStatus;
  startedAt: string | null;
  endedAt: string | null;
  elapsedSeconds: number | null;
  assignedMinutes: number | null;
};

export type AuditLogEntry = {
  moduleKey: string;
  label: string;
  runNumber: number;
  startedAt: string | null;
  endedAt: string | null;
  elapsedSeconds: number | null;
  isRunning: boolean;
  startedBy: string | null;
};

export type SessionDashboard = {
  conferenceUid: string;
  title: string;
  trainingType: string | null;
  conferenceDate: string | null;
  conferenceTime: string | null;
  trainerName: string | null;
  location: string | null;
  conferenceStatus: string;
  approvalStatus: string;
  activeModuleId: string | null;
  actualStartedAt: string | null;
  actualEndedAt: string | null;
  runtimeSeconds: number | null;
  audience: AudienceBreakdown;
  assessment: AssessmentSummary;
  topPerformers: TopPerformer[];
  trainees: TraineeRow[];
  executionFlow: ExecutionFlowItem[];
  auditLog: AuditLogEntry[];
};

export function createTraining(token: string, payload: TrainingCreatePayload) {
  if (USE_MOCK_DATA) return mock.createTraining(token, payload);
  return apiRequest<TrainingOut>("/admin/trainings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function fetchTrainerAgenda(token: string, range?: { start?: string; end?: string }) {
  if (USE_MOCK_DATA) return mock.fetchTrainerAgenda(token, range);
  const params = new URLSearchParams();
  if (range?.start) params.set("start", range.start);
  if (range?.end) params.set("end", range.end);
  const query = params.toString();
  if (USE_MOCK_DATA) return mock.fetchTrainerAgenda(token, range);
  return apiRequest<TrainingAgendaItem[]>(`/admin/trainings${query ? `?${query}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchSessionDashboard(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.fetchSessionDashboard(token, conferenceUid);
  return apiRequest<SessionDashboard>(`/admin/trainings/${encodeURIComponent(conferenceUid)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function startTraining(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.startTraining(token, conferenceUid);
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function endTraining(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.endTraining(token, conferenceUid);
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/end`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function advanceModule(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.advanceModule(token, conferenceUid);
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/advance-module`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function markAttendance(token: string, conferenceUid: string, traineeUid: string, status: "Present" | "Absent") {
  if (USE_MOCK_DATA) return mock.markAttendance(token, conferenceUid, traineeUid, status);
  return apiRequest<SessionDashboard>(
    `/admin/trainings/${encodeURIComponent(conferenceUid)}/attendance/${encodeURIComponent(traineeUid)}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }
  );
}

export function resetAttendance(token: string, conferenceUid: string, traineeUid: string) {
  if (USE_MOCK_DATA) return mock.resetAttendance(token, conferenceUid, traineeUid);
  return apiRequest<SessionDashboard>(
    `/admin/trainings/${encodeURIComponent(conferenceUid)}/attendance/${encodeURIComponent(traineeUid)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export function fetchAssessmentSuites(token: string) {
  if (USE_MOCK_DATA) return mock.fetchAssessmentSuites(token);
  return apiRequest<AssessmentSuiteOut[]>("/admin/assessment-suites", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchTrainerName(token: string, username: string) {
  if (USE_MOCK_DATA) return mock.fetchTrainerName(token, username);
  return apiRequest<{ username: string; name: string }>(
    `/admin/trainers/${encodeURIComponent(username)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export type PendingSessionItem = {
  conferenceUid: string;
  title: string;
  trainerName: string | null;
  conferenceDate: string | null;
  conferenceTime: string | null;
  status: string;
};

export function fetchPendingTrainings(token: string) {
  if (USE_MOCK_DATA) return mock.fetchPendingTrainings(token);
  return apiRequest<PendingSessionItem[]>("/admin/trainings/pending", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function approveTraining(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.approveTraining(token, conferenceUid);
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function rejectTraining(token: string, conferenceUid: string) {
  if (USE_MOCK_DATA) return mock.rejectTraining(token, conferenceUid);
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/reject`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type QuestionOption = { id: string; text: string };

export type QuestionOut = {
  id: number;
  question: string;
  questionType: string;
  options: QuestionOption[];
  correctAnswer: string | null;
  points: number;
  timerSeconds: number | null;
  explanation: string | null;
  sortOrder: number;
};

export type QuestionCreatePayload = {
  question: string;
  questionType?: string;
  options?: QuestionOption[];
  correctAnswer?: string;
  points?: number;
  timerSeconds?: number;
  explanation?: string;
};

export type AssessmentSuiteDetail = {
  assessmentSuiteUid: string;
  title: string;
  description: string | null;
  category: string;
  testTime: string | null;
  type: string;
  noOfQuestion: number;
  questions: QuestionOut[];
};

export type AssessmentSuiteCreatePayload = {
  title: string;
  description?: string;
  category: string;
  testTime?: string;
  type?: string;
};

export function createAssessmentSuite(token: string, payload: AssessmentSuiteCreatePayload) {
  if (USE_MOCK_DATA) return mock.createAssessmentSuite(token, payload);
  return apiRequest<AssessmentSuiteDetail>("/admin/assessment-suites", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function fetchAssessmentSuiteDetail(token: string, suiteUid: string) {
  if (USE_MOCK_DATA) return mock.fetchAssessmentSuiteDetail(token, suiteUid);
  return apiRequest<AssessmentSuiteDetail>(`/admin/assessment-suites/${encodeURIComponent(suiteUid)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function addAssessmentQuestion(token: string, suiteUid: string, payload: QuestionCreatePayload) {
  if (USE_MOCK_DATA) return mock.addAssessmentQuestion(token, suiteUid, payload);
  return apiRequest<AssessmentSuiteDetail>(`/admin/assessment-suites/${encodeURIComponent(suiteUid)}/questions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteAssessmentQuestion(token: string, suiteUid: string, questionId: number) {
  if (USE_MOCK_DATA) return mock.deleteAssessmentQuestion(token, suiteUid, questionId);
  return apiRequest<AssessmentSuiteDetail>(
    `/admin/assessment-suites/${encodeURIComponent(suiteUid)}/questions/${questionId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export { ApiError } from "./client";
