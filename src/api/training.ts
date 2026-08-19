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
  conferenceDate: string | null;
  conferenceTime: string | null;
  conferenceStatus: string;
  approvalStatus: string;
  location: string | null;
  batchSize: string | null;
  trainingType: string | null;
  state: string | null;
  trainingHub: string | null;
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

export type PendingSessionItem = {
  conferenceUid: string;
  title: string;
  trainerName: string | null;
  conferenceDate: string | null;
  conferenceTime: string | null;
  status: string;
};

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

// Demo implementations — no network calls.
export {
  createTraining,
  fetchTrainerAgenda,
  fetchSessionDashboard,
  startTraining,
  endTraining,
  advanceModule,
  markAttendance,
  resetAttendance,
  fetchAssessmentSuites,
  fetchTrainerName,
  fetchPendingTrainings,
  approveTraining,
  rejectTraining,
  createAssessmentSuite,
  fetchAssessmentSuiteDetail,
  addAssessmentQuestion,
  deleteAssessmentQuestion,
} from "@/api/mockService";
export { ApiError } from "@/api/client";
