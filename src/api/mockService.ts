/**
 * mockService.ts — All mock API implementations for the frontend-only demo.
 *
 * Every function maintains the SAME TypeScript signature as its real counterpart
 * so api/* files can simply re-export from here without any call-site changes.
 *
 * Mutable module-level state persists within a single app session (resets on restart).
 */

import {
  DEMO_ADMIN_SESSION_ADMIN,
  DEMO_ADMIN_SESSION_TRAINER,
  DEMO_ADMIN_TRAINER,
  DEMO_AGENDA,
  DEMO_ASSESSMENT_QUESTIONS,
  DEMO_ASSESSMENT_SUITES,
  DEMO_AUTH_SESSION,
  DEMO_CURRENT_SESSION,
  DEMO_PENDING_SESSIONS,
  DEMO_SESSION_DASHBOARD,
  DEMO_SESSION_HISTORY,
  DEMO_SUITE_DETAIL_BASE,
  DEMO_SURVEY_QUESTIONS,
  DEMO_TRAINEE,
} from "@/data/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const delay = (ms = 650) => new Promise<void>((r) => setTimeout(r, ms));
function uuid() {
  return `demo-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`;
}
const pad2 = (n: number) => String(n).padStart(2, "0");
function nowStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

// ─── Mutable in-memory state (module-level, resets on app restart) ─────────────
let _trainee = { ...DEMO_TRAINEE };
let _dashboard = JSON.parse(
  JSON.stringify(DEMO_SESSION_DASHBOARD),
) as typeof DEMO_SESSION_DASHBOARD;
let _agenda = JSON.parse(JSON.stringify(DEMO_AGENDA)) as typeof DEMO_AGENDA;
let _pending = JSON.parse(
  JSON.stringify(DEMO_PENDING_SESSIONS),
) as typeof DEMO_PENDING_SESSIONS;

type SuiteDetail = typeof DEMO_SUITE_DETAIL_BASE;
let _suites: SuiteDetail[] = [
  JSON.parse(JSON.stringify(DEMO_SUITE_DETAIL_BASE)),
];

// ─── Admin Auth ───────────────────────────────────────────────────────────────
export async function loginAdmin(username: string, _password: string) {
  await delay();
  return username.trim().toLowerCase() === "admin"
    ? { ...DEMO_ADMIN_SESSION_ADMIN }
    : { ...DEMO_ADMIN_SESSION_TRAINER };
}

// ─── Trainee Auth ─────────────────────────────────────────────────────────────
export async function registerTrainee(payload: {
  name: string;
  phone: string;
  email: string;
  gender?: string;
  designation?: string;
  employee_id?: string;
  supervisorName?: string;
  state?: string;
  district?: string;
}) {
  await delay();
  _trainee = {
    ..._trainee,
    name: payload.name,
    phone: Number(payload.phone) || _trainee.phone,
    email: payload.email,
    gender: payload.gender ?? null,
    designation: payload.designation ?? null,
    employee_id: payload.employee_id ?? null,
    supervisorName: payload.supervisorName ?? null,
    state: payload.state ?? null,
    district: payload.district ?? null,
  };
  return { ..._trainee };
}

export async function loginTrainee(_phone: string) {
  await delay();
  return { ...DEMO_AUTH_SESSION, trainee: { ..._trainee } };
}

export async function updateTrainee(
  _token: string,
  payload: {
    name?: string;
    phone?: string;
    email?: string;
    gender?: string;
    designation?: string;
    employee_id?: string;
    supervisorName?: string;
    state?: string;
    district?: string;
  },
) {
  await delay();
  if (payload.name !== undefined) _trainee.name = payload.name;
  if (payload.phone !== undefined)
    _trainee.phone = Number(payload.phone) || _trainee.phone;
  if (payload.email !== undefined) _trainee.email = payload.email;
  if (payload.gender !== undefined) _trainee.gender = payload.gender || null;
  if (payload.designation !== undefined)
    _trainee.designation = payload.designation || null;
  if (payload.employee_id !== undefined)
    _trainee.employee_id = payload.employee_id || null;
  if (payload.supervisorName !== undefined)
    _trainee.supervisorName = payload.supervisorName || null;
  if (payload.state !== undefined) _trainee.state = payload.state || null;
  if (payload.district !== undefined)
    _trainee.district = payload.district || null;
  return {
    access_token: "demo-access-token-trainee",
    token_type: "bearer",
    trainee: { ..._trainee },
  };
}

export async function uploadTraineePhoto(
  _token: string,
  image: { uri: string; name: string; type: string },
) {
  await delay(1200);
  _trainee = { ..._trainee, profilePhoto: image.uri };
  return { ..._trainee };
}

// ─── Session ──────────────────────────────────────────────────────────────────
let _currentSession = {
  ...DEMO_CURRENT_SESSION,
  modules: DEMO_CURRENT_SESSION.modules.map((m) => ({ ...m })),
};

export async function getCurrentSession(_token: string) {
  await delay();
  return {
    ..._currentSession,
    modules: _currentSession.modules.map((m) => ({ ...m })),
  };
}

export async function getSessionHistory(_token: string) {
  await delay();
  return DEMO_SESSION_HISTORY.map((h) => ({ ...h }));
}

// ─── Attendance ───────────────────────────────────────────────────────────────
export async function checkIn(_token: string, _conferenceUid: string) {
  await delay();
  return { status: "Present", markedOn: nowStr(), distanceMeters: 42 };
}

export async function verifyLocation(
  _token: string,
  _conferenceUid: string,
  _latitude: number,
  _longitude: number,
) {
  await delay(900);
  return {
    distanceMeters: 38,
    withinRadius: true,
    venueLabel: "Samsung Training Hub",
  };
}

export async function secureCheckIn(
  _token: string,
  payload: {
    conferenceUid: string;
    latitude: number;
    longitude: number;
    photo: { uri: string; name: string; type: string };
  },
) {
  await delay(1400);
  return { status: "Present", markedOn: nowStr(), distanceMeters: 42 };
}

// ─── Proctoring ───────────────────────────────────────────────────────────────
/** Always returns faceCount: 1 so no proctoring warnings fire in demo mode. */
export async function checkFrameForFaces(_token: string, _imageBase64: string) {
  return { faceCount: 1 };
}

// ─── Assessment Questions & Submit ────────────────────────────────────────────
export async function getAssessmentQuestions(_token: string, suiteUid: string) {
  await delay();
  const isSurvey = suiteUid.includes("survey");
  const isQuiz = suiteUid.includes("quiz");
  const questions = isSurvey
    ? DEMO_SURVEY_QUESTIONS
    : isQuiz
      ? DEMO_ASSESSMENT_QUESTIONS.slice(0, 4)
      : DEMO_ASSESSMENT_QUESTIONS;
  const title = isSurvey
    ? "Training Feedback Survey"
    : isQuiz
      ? "Galaxy AI Live Quiz"
      : "Samsung Galaxy S26 Post Test";
  return {
    title,
    testTime: isSurvey ? null : isQuiz ? "2" : "30",
    questions: questions.map((q) => ({ ...q, options: [...q.options] })),
  };
}

export async function submitAssessment(
  _token: string,
  suiteUid: string,
  _conferenceUid: string,
  answers: { questionId: number; selectedOption: string | null }[],
) {
  await delay(900);
  const isQuiz = suiteUid.includes("quiz");
  const questions = isQuiz
    ? DEMO_ASSESSMENT_QUESTIONS.slice(0, 4)
    : DEMO_ASSESSMENT_QUESTIONS;
  const totalQuestions = answers.length || (isQuiz ? 4 : 10);
  let correctCount = 0;
  answers.forEach((ans, idx) => {
    const q =
      questions.find((item) => item.id === ans.questionId) ?? questions[idx];
    if (q && ans.selectedOption && ans.selectedOption === q.correctAnswer) {
      correctCount++;
    }
  });

  if (answers.length === 0) {
    correctCount = isQuiz ? 3 : 9;
  }

  const scoreStr = `${correctCount}/${totalQuestions}`;

  _currentSession = {
    ..._currentSession,
    modules: _currentSession.modules.map((m) => {
      if (m.key === "LIVE_QUIZ") {
        return {
          ...m,
          isCompleted: true,
          isLive: false,
          score: scoreStr,
          completedAt: "Completed successfully",
          ranDuration: "Ran : 1h 55m",
        };
      }
      if (m.key === "STANDARD_TEST") {
        return {
          ...m,
          isLive: true,
        };
      }
      return m;
    }),
  };

  return {
    totalScore: correctCount,
    maxScore: totalQuestions,
    percentage: Math.round((correctCount / totalQuestions) * 100),
    correctCount,
    totalQuestions,
  };
}

// ─── Trainer Agenda ───────────────────────────────────────────────────────────
export async function fetchTrainerAgenda(
  _token: string,
  _range?: { start?: string; end?: string },
) {
  await delay();
  return _agenda.map((item) => ({ ...item }));
}

export async function fetchTrainerName(_token: string, _username: string) {
  await delay();
  return {
    username: DEMO_ADMIN_TRAINER.username,
    name: DEMO_ADMIN_TRAINER.name,
  };
}

// ─── Session Dashboard ────────────────────────────────────────────────────────
export async function fetchSessionDashboard(
  _token: string,
  _conferenceUid: string,
) {
  await delay();
  return JSON.parse(JSON.stringify(_dashboard)) as typeof _dashboard;
}

export async function startTraining(_token: string, _conferenceUid: string) {
  await delay();
  _dashboard.conferenceStatus = "Ongoing";
  _dashboard.actualStartedAt = nowStr();
  _dashboard.runtimeSeconds = 0;
  return {
    conferenceUid: _dashboard.conferenceUid,
    conferenceStatus: "Ongoing",
    status: "ok",
  };
}

export async function endTraining(_token: string, _conferenceUid: string) {
  await delay();
  _dashboard.conferenceStatus = "Completed";
  _dashboard.actualEndedAt = nowStr();
  return {
    conferenceUid: _dashboard.conferenceUid,
    conferenceStatus: "Completed",
    status: "ok",
  };
}

export async function advanceModule(_token: string, _conferenceUid: string) {
  await delay();
  const flow = _dashboard.executionFlow;
  const runIdx = flow.findIndex((f) => f.status === "Running");
  if (runIdx !== -1) {
    flow[runIdx].status = "Completed";
    flow[runIdx].endedAt = nowStr();
    if (runIdx + 1 < flow.length) {
      flow[runIdx + 1].status = "Running";
      flow[runIdx + 1].startedAt = nowStr();
      _dashboard.activeModuleId = flow[runIdx + 1].moduleKey;
    } else {
      _dashboard.activeModuleId = null;
    }
  }
  return {
    conferenceUid: _dashboard.conferenceUid,
    conferenceStatus: _dashboard.conferenceStatus,
    status: "ok",
  };
}

export async function markAttendance(
  _token: string,
  _conferenceUid: string,
  traineeUid: string,
  status: "Present" | "Absent",
) {
  await delay();
  const row = _dashboard.trainees.find((t) => t.traineeUid === traineeUid);
  if (row) {
    row.status = status;
    row.markedOn = status === "Present" ? nowStr() : null;
  }
  _dashboard.audience.present = _dashboard.trainees.filter(
    (t) => t.status === "Present",
  ).length;
  return JSON.parse(JSON.stringify(_dashboard)) as typeof _dashboard;
}

export async function resetAttendance(
  _token: string,
  _conferenceUid: string,
  traineeUid: string,
) {
  await delay();
  const row = _dashboard.trainees.find((t) => t.traineeUid === traineeUid);
  if (row) {
    row.status = "Not Marked";
    row.markedOn = null;
  }
  _dashboard.audience.present = _dashboard.trainees.filter(
    (t) => t.status === "Present",
  ).length;
  return JSON.parse(JSON.stringify(_dashboard)) as typeof _dashboard;
}

// ─── Assessment Suites (Admin) ────────────────────────────────────────────────
export async function fetchAssessmentSuites(_token: string) {
  await delay();
  return DEMO_ASSESSMENT_SUITES.map((s) => ({ ...s }));
}

export async function fetchPendingTrainings(_token: string) {
  await delay();
  return _pending.map((p) => ({ ...p }));
}

export async function approveTraining(_token: string, conferenceUid: string) {
  await delay();
  _pending = _pending.filter((p) => p.conferenceUid !== conferenceUid);
  const item = _agenda.find((a) => a.conferenceUid === conferenceUid);
  if (item) item.approvalStatus = "Approved";
  return { conferenceUid, conferenceStatus: "Scheduled", status: "ok" };
}

export async function rejectTraining(_token: string, conferenceUid: string) {
  await delay();
  _pending = _pending.filter((p) => p.conferenceUid !== conferenceUid);
  const item = _agenda.find((a) => a.conferenceUid === conferenceUid);
  if (item) item.approvalStatus = "Rejected";
  return { conferenceUid, conferenceStatus: "Scheduled", status: "ok" };
}

export async function createTraining(
  _token: string,
  payload: Record<string, unknown>,
) {
  await delay(1000);
  const uid = uuid();
  _agenda.push({
    conferenceUid: uid,
    title: (payload.title as string) || "New Training Session",
    conferenceDate: (payload.conferenceDate as string | null) ?? null,
    conferenceTime: (payload.conferenceTime as string | null) ?? null,
    conferenceStatus: "Scheduled",
    approvalStatus: "Pending",
    location: (payload.venue as string | null) ?? null,
    batchSize: (payload.batchSize as string | null) ?? null,
    trainingType: (payload.trainingType as string | null) ?? null,
    state: (payload.state as string | null) ?? null,
    trainingHub: (payload.trainingHub as string | null) ?? null,
  });
  return { conferenceUid: uid, conferenceStatus: "Scheduled", status: "ok" };
}

// ─── Assessment Builder ───────────────────────────────────────────────────────
export async function createAssessmentSuite(
  _token: string,
  payload: {
    title: string;
    description?: string;
    category: string;
    testTime?: string;
    type?: string;
  },
) {
  await delay();
  const newSuite: SuiteDetail = {
    assessmentSuiteUid: uuid(),
    title: payload.title,
    description: payload.description ?? null,
    category: payload.category,
    testTime: payload.testTime ?? null,
    type: payload.type ?? "Test",
    noOfQuestion: 0,
    questions: [],
  };
  _suites.push(newSuite);
  return JSON.parse(JSON.stringify(newSuite)) as SuiteDetail;
}

export async function fetchAssessmentSuiteDetail(
  _token: string,
  suiteUid: string,
) {
  await delay();
  const suite =
    _suites.find((s) => s.assessmentSuiteUid === suiteUid) ?? _suites[0];
  return JSON.parse(JSON.stringify(suite)) as SuiteDetail;
}

export async function addAssessmentQuestion(
  _token: string,
  suiteUid: string,
  payload: {
    question: string;
    questionType?: string;
    options?: { id: string; text: string }[];
    correctAnswer?: string;
    points?: number;
    timerSeconds?: number;
    explanation?: string;
  },
) {
  await delay();
  const suite =
    _suites.find((s) => s.assessmentSuiteUid === suiteUid) ?? _suites[0];
  suite.questions.push({
    id: Date.now(),
    question: payload.question,
    questionType: payload.questionType ?? "multiple_choice",
    options: payload.options ?? [],
    correctAnswer: payload.correctAnswer ?? null,
    points: payload.points ?? 1,
    timerSeconds: payload.timerSeconds ?? null,
    explanation: payload.explanation ?? null,
    sortOrder: suite.questions.length,
  });
  suite.noOfQuestion = suite.questions.length;
  return JSON.parse(JSON.stringify(suite)) as SuiteDetail;
}

export async function deleteAssessmentQuestion(
  _token: string,
  suiteUid: string,
  questionId: number,
) {
  await delay();
  const suite =
    _suites.find((s) => s.assessmentSuiteUid === suiteUid) ?? _suites[0];
  suite.questions = suite.questions.filter((q) => q.id !== questionId);
  suite.noOfQuestion = suite.questions.length;
  return JSON.parse(JSON.stringify(suite)) as SuiteDetail;
}
