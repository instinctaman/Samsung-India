import { SelectOption } from "@/components/ui/SearchableSelect";
import { apiRequest, apiUpload } from "./client";
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
  trainingEndDate?: string;
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
  traineeCount?: number;
  hoid: string | null;
  venueName: string | null;
  district: string | null;
  updatedBy: string | null;
  updationOn: string | null;
  timestamp: string | null;
};

export type TrainerAgendaResponse = {
  trainings: TrainingAgendaItem[];
  totalTrainees: number;
  totalSessions: number;
  completed: number;
  pending: number;
  executedPercentage: number;
  pendingPercentage: number;
  recentCompleted: TrainingAgendaItem[];
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
  score: number;
  maxScore: number;
  percentage: number;
};

export type SessionHeroStat = {
  moduleKey: string; // "LIVE_QUIZ" | "STANDARD_TEST"
  label: string;
  participants: number;
  averagePercent: number;
  bestPercent: number;
  topName: string | null;
};

export type TraineeRow = {
  traineeUid: string;
  name: string;
  employeeId: string | null;
  phone: number | null;
  audienceType: string;
  status: string; // "Present" | "Pending" | "Absent" | "Attempted"
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

export type LiveStudioQuestion = {
  id: number;
  order: number;
  text: string;
  timerSeconds: number;
  points: number;
  responseCount: number;
  isActive: boolean;
};

export type LiveStudio = {
  suiteUid: string;
  suiteTitle: string;
  state: "IDLE" | "WAITING" | "QUESTION_LIVE" | "LEADERBOARD" | "FINISHED" | string;
  activeQuestionId: number | null;
  timerEndsAt: number | null;
  participants: number;
  totalResponses: number;
  questions: LiveStudioQuestion[];
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
  activeModuleQuestionCount: number | null;
  actualStartedAt: string | null;
  actualEndedAt: string | null;
  runtimeSeconds: number | null;
  audience: AudienceBreakdown;
  assessment: AssessmentSummary;
  topPerformers: TopPerformer[];
  trainees: TraineeRow[];
  executionFlow: ExecutionFlowItem[];
  auditLog: AuditLogEntry[];
  sessionHeroes: SessionHeroStat[];
  // Present only while LIVE_QUIZ is the active module.
  liveStudio: LiveStudio | null;
};

export function createTraining(token: string, payload: TrainingCreatePayload) {
  return apiRequest<TrainingOut>("/admin/trainings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function fetchTrainerAgenda(token: string, range?: { start?: string; end?: string; all?: boolean }) {
  const params = new URLSearchParams();
  if (range?.start) params.set("start", range.start);
  if (range?.end) params.set("end", range.end);
  if (range?.all) params.set("all_sessions", "true");
  const query = params.toString();
  return apiRequest<TrainerAgendaResponse>(`/admin/trainings${query ? `?${query}` : ""}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchSessionDashboard(token: string, conferenceUid: string) {
  return apiRequest<SessionDashboard>(`/admin/trainings/${encodeURIComponent(conferenceUid)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function startTraining(
  token: string,
  conferenceUid: string,
  photo: { uri: string; name: string; type: string },
) {
  const formData = new FormData();
  formData.append("photo", { uri: photo.uri, name: photo.name, type: photo.type } as unknown as Blob);
  return apiUpload<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/start`, formData, token);
}

export function endTraining(token: string, conferenceUid: string) {
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/end`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function advanceModule(token: string, conferenceUid: string) {
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/advance-module`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- Live Quiz (FFF) broadcast console --------------------------------------

function liveQuizAction(token: string, conferenceUid: string, action: string, body?: unknown) {
  return apiRequest<SessionDashboard>(
    `/admin/trainings/${encodeURIComponent(conferenceUid)}/live-quiz/${action}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
  );
}

export function broadcastLiveQuestion(token: string, conferenceUid: string, questionId: number) {
  return liveQuizAction(token, conferenceUid, "broadcast", { questionId });
}

export function stopLiveTimer(token: string, conferenceUid: string) {
  return liveQuizAction(token, conferenceUid, "stop-timer");
}

export function showLiveLeaderboard(token: string, conferenceUid: string) {
  return liveQuizAction(token, conferenceUid, "leaderboard");
}

export function showLiveLobby(token: string, conferenceUid: string) {
  return liveQuizAction(token, conferenceUid, "lobby");
}

export function finishLiveQuiz(token: string, conferenceUid: string) {
  return liveQuizAction(token, conferenceUid, "finish");
}

export function markAttendance(token: string, conferenceUid: string, traineeUid: string, status: "Present" | "Absent") {
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
  return apiRequest<SessionDashboard>(
    `/admin/trainings/${encodeURIComponent(conferenceUid)}/attendance/${encodeURIComponent(traineeUid)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export function fetchAssessmentSuites(token: string) {
  return apiRequest<AssessmentSuiteOut[]>("/admin/assessment-suites", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchTrainerName(token: string, username: string) {
  return apiRequest<{ username: string; name: string }>(
    `/admin/trainers/${encodeURIComponent(username)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function fetchTrainers(token: string) {
  return apiRequest<SelectOption[]>("/admin/trainers", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchVenues(token: string, district?: string) {
  const query = district ? `?district=${encodeURIComponent(district)}` : "";
  return apiRequest<SelectOption[]>(`/admin/venues${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function fetchChecklistItems(token: string) {
  return apiRequest<SelectOption[]>("/admin/checklist-items", {
    headers: { Authorization: `Bearer ${token}` },
  });
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
  return apiRequest<PendingSessionItem[]>("/admin/trainings/pending", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function approveTraining(token: string, conferenceUid: string) {
  return apiRequest<TrainingOut>(`/admin/trainings/${encodeURIComponent(conferenceUid)}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function rejectTraining(token: string, conferenceUid: string) {
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
  return apiRequest<AssessmentSuiteDetail>("/admin/assessment-suites", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function fetchAssessmentSuiteDetail(token: string, suiteUid: string) {
  return apiRequest<AssessmentSuiteDetail>(`/admin/assessment-suites/${encodeURIComponent(suiteUid)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function addAssessmentQuestion(token: string, suiteUid: string, payload: QuestionCreatePayload) {
  return apiRequest<AssessmentSuiteDetail>(`/admin/assessment-suites/${encodeURIComponent(suiteUid)}/questions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteAssessmentQuestion(token: string, suiteUid: string, questionId: number) {
  return apiRequest<AssessmentSuiteDetail>(
    `/admin/assessment-suites/${encodeURIComponent(suiteUid)}/questions/${questionId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export { ApiError } from "./client";
