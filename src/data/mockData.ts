/**
 * mockData.ts — Centralized demo data for Samsung India Training App.
 *
 * Single source of truth for all frontend-only demo data.
 * No imports from api/* to avoid circular dependencies with mockService.ts.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────
const _pad2 = (n: number) => String(n).padStart(2, "0");
function _daysFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${_pad2(d.getMonth() + 1)}-${_pad2(d.getDate())}`;
}

export const TODAY_STR = _daysFromToday(0);
export const TOMORROW_STR = _daysFromToday(1);
export const YESTERDAY_STR = _daysFromToday(-1);

// ─── Trainee ─────────────────────────────────────────────────────────────────
export const DEMO_TRAINEE = {
  id: 1,
  traineeUid: "demo-trainee-uid-001",
  name: "Arjun Mehta",
  phone: 9876543210 as number,
  email: "arjun.mehta@samsung.com",
  gender: "male" as string | null,
  designation: "Sales Associate" as string | null,
  employee_id: "EMP-20240001" as string | null,
  supervisorName: "Priya Sharma" as string | null,
  state: "delhi" as string | null,
  district: "new_delhi" as string | null,
  profilePhoto: null as string | null,
  status: "Active",
};

export const DEMO_AUTH_SESSION = {
  access_token: "demo-access-token-trainee",
  token_type: "bearer",
  trainee: { ...DEMO_TRAINEE },
};

// ─── Admin / Trainer ──────────────────────────────────────────────────────────
export const DEMO_ADMIN_TRAINER = { username: "trainer1", name: "Rajesh Kumar", role: "trainer" };
export const DEMO_ADMIN_ADMIN   = { username: "admin",    name: "Priya Sharma",  role: "admin"   };

export const DEMO_ADMIN_SESSION_TRAINER = {
  access_token: "demo-access-token-trainer",
  token_type: "bearer",
  admin: { ...DEMO_ADMIN_TRAINER },
};

export const DEMO_ADMIN_SESSION_ADMIN = {
  access_token: "demo-access-token-admin",
  token_type: "bearer",
  admin: { ...DEMO_ADMIN_ADMIN },
};

// ─── Current Session (Trainee view) ──────────────────────────────────────────
export const DEMO_CURRENT_SESSION = {
  conferenceUid: "demo-conf-uid-main",
  title: "Samsung Galaxy S26 Product Training",
  sessionType: "Classroom Training" as string | null,
  date: TODAY_STR as string | null,
  location: "Samsung Training Hub, New Delhi" as string | null,
  trainerName: "Rajesh Kumar" as string | null,
  confirmationStatus: "Confirmed",
  started: true,
  startsAt: "10:00 AM" as string | null,
  attendanceGeoFencing: false,
  modules: [
    {
      key: "ATTENDANCE"    as "ATTENDANCE" | "STANDARD_TEST" | "LIVE_QUIZ" | "SURVEY",
      name: "Attendance",   time: "10:00" as string | null, endTime: "10:30" as string | null,
      duration: "30 min" as string | null, isLive: true,  isCompleted: false, isMissed: false,
      completedAt: null as string | null,  score: null as string | null, assessmentSuiteUid: null as string | null,
    },
    {
      key: "STANDARD_TEST" as "ATTENDANCE" | "STANDARD_TEST" | "LIVE_QUIZ" | "SURVEY",
      name: "Standard Test", time: "10:30" as string | null, endTime: "11:30" as string | null,
      duration: "60 min" as string | null, isLive: true,  isCompleted: false, isMissed: false,
      completedAt: null as string | null,  score: null as string | null, assessmentSuiteUid: "suite-post-test-001" as string | null,
    },
    {
      key: "LIVE_QUIZ"     as "ATTENDANCE" | "STANDARD_TEST" | "LIVE_QUIZ" | "SURVEY",
      name: "Live Quiz",    time: "11:30" as string | null, endTime: "12:00" as string | null,
      duration: "30 min" as string | null, isLive: true,  isCompleted: false, isMissed: false,
      completedAt: null as string | null,  score: null as string | null, assessmentSuiteUid: "suite-quiz-001" as string | null,
    },
    {
      key: "SURVEY"        as "ATTENDANCE" | "STANDARD_TEST" | "LIVE_QUIZ" | "SURVEY",
      name: "Survey",       time: "12:00" as string | null, endTime: "12:30" as string | null,
      duration: "30 min" as string | null, isLive: true,  isCompleted: false, isMissed: false,
      completedAt: null as string | null,  score: null as string | null, assessmentSuiteUid: "suite-survey-001" as string | null,
    },
  ],
};

// ─── Session History (Trainee) ────────────────────────────────────────────────
export const DEMO_SESSION_HISTORY = [
  { conferenceUid: "hist-conf-001", title: "Samsung Galaxy S25 Flagship Training",   date: "2026-07-10" as string | null, trainerName: "Sunita Patel" as string | null, attendanceStatus: "Present" as string | null, score: "88%" as string | null, passed: true  as boolean | null },
  { conferenceUid: "hist-conf-002", title: "Samsung Smart Home Ecosystem Workshop",  date: "2026-06-22" as string | null, trainerName: "Vikram Nair"  as string | null, attendanceStatus: "Present" as string | null, score: "72%" as string | null, passed: true  as boolean | null },
  { conferenceUid: "hist-conf-003", title: "Galaxy AI Features Deep Dive",           date: "2026-05-18" as string | null, trainerName: "Ananya Reddy" as string | null, attendanceStatus: "Present" as string | null, score: "56%" as string | null, passed: false as boolean | null },
];

// ─── Trainer Agenda ───────────────────────────────────────────────────────────
export const DEMO_AGENDA = [
  { conferenceUid: "demo-conf-uid-main",    title: "Samsung Galaxy S26 Product Training",  conferenceDate: TODAY_STR     as string | null, conferenceTime: "10:00" as string | null, conferenceStatus: "Ongoing",   approvalStatus: "Approved", location: "Samsung Training Hub, New Delhi"        as string | null, batchSize: "25" as string | null, trainingType: "Product Training"    as string | null, state: "delhi"   as string | null, trainingHub: "Delhi"        as string | null },
  { conferenceUid: "demo-conf-uid-sched-1", title: "Galaxy AI Features Deep Dive",          conferenceDate: TOMORROW_STR  as string | null, conferenceTime: "09:00" as string | null, conferenceStatus: "Scheduled", approvalStatus: "Approved", location: "Samsung Experience Centre, Gurugram"    as string | null, batchSize: "30" as string | null, trainingType: "Classroom Training" as string | null, state: "haryana" as string | null, trainingHub: "Not Assigned" as string | null },
  { conferenceUid: "demo-conf-uid-comp-1",  title: "Samsung Smart Home Ecosystem",          conferenceDate: YESTERDAY_STR as string | null, conferenceTime: "11:00" as string | null, conferenceStatus: "Completed", approvalStatus: "Approved", location: "Samsung Service Centre, Noida"          as string | null, batchSize: "20" as string | null, trainingType: "Webinar"            as string | null, state: "up"      as string | null, trainingHub: "Delhi"        as string | null },
  { conferenceUid: "demo-conf-uid-pend-1",  title: "SEC Plan Refresher Workshop",            conferenceDate: TOMORROW_STR  as string | null, conferenceTime: "14:00" as string | null, conferenceStatus: "Scheduled", approvalStatus: "Pending",  location: "Samsung Training Hub, Lucknow"          as string | null, batchSize: "15" as string | null, trainingType: "Product Training"    as string | null, state: "up"      as string | null, trainingHub: "Not Assigned" as string | null },
];

// ─── Session Dashboard — Trainee Rows ────────────────────────────────────────
export const DEMO_TRAINEE_ROWS = [
  { traineeUid: "t-001", name: "Arjun Mehta",    phone: 9876543210 as number | null, status: "Present",    markedOn: (`${TODAY_STR} 10:12:00`) as string | null, checkOutTime: null as string | null, score: "88%" as string | null, profilePhoto: null as string | null },
  { traineeUid: "t-002", name: "Priyanka Singh", phone: 9876543211 as number | null, status: "Present",    markedOn: (`${TODAY_STR} 10:08:00`) as string | null, checkOutTime: null as string | null, score: "92%" as string | null, profilePhoto: null as string | null },
  { traineeUid: "t-003", name: "Rahul Sharma",   phone: 9876543212 as number | null, status: "Present",    markedOn: (`${TODAY_STR} 10:15:00`) as string | null, checkOutTime: null as string | null, score: "76%" as string | null, profilePhoto: null as string | null },
  { traineeUid: "t-004", name: "Sunita Patel",   phone: 9876543213 as number | null, status: "Absent",     markedOn: null,                                        checkOutTime: null as string | null, score: null,                   profilePhoto: null as string | null },
  { traineeUid: "t-005", name: "Vikram Nair",    phone: 9876543214 as number | null, status: "Present",    markedOn: (`${TODAY_STR} 10:05:00`) as string | null, checkOutTime: null as string | null, score: "84%" as string | null, profilePhoto: null as string | null },
  { traineeUid: "t-006", name: "Ananya Reddy",   phone: 9876543215 as number | null, status: "Present",    markedOn: (`${TODAY_STR} 10:10:00`) as string | null, checkOutTime: null as string | null, score: null,                   profilePhoto: null as string | null },
  { traineeUid: "t-007", name: "Karan Joshi",    phone: 9876543216 as number | null, status: "Not Marked", markedOn: null,                                        checkOutTime: null as string | null, score: null,                   profilePhoto: null as string | null },
  { traineeUid: "t-008", name: "Meera Iyer",     phone: 9876543217 as number | null, status: "Present",    markedOn: (`${TODAY_STR} 10:18:00`) as string | null, checkOutTime: null as string | null, score: "95%" as string | null, profilePhoto: null as string | null },
];

// ─── Session Dashboard (Trainer view) ────────────────────────────────────────
export const DEMO_SESSION_DASHBOARD = {
  conferenceUid: "demo-conf-uid-main",
  title: "Samsung Galaxy S26 Product Training",
  conferenceDate: TODAY_STR     as string | null,
  conferenceTime: "10:00"       as string | null,
  trainerName: "Rajesh Kumar"   as string | null,
  location: "Samsung Training Hub, New Delhi" as string | null,
  conferenceStatus: "Ongoing",
  approvalStatus: "Approved",
  activeModuleId: "ATTENDANCE"  as string | null,
  actualStartedAt: (`${TODAY_STR} 10:00:00`) as string | null,
  actualEndedAt: null           as string | null,
  runtimeSeconds: 2400          as number | null,
  audience: { total: 8, present: 5 },
  assessment: { pass: 4, fail: 1, totalAttempts: 5 },
  topPerformers: [
    { traineeUid: "t-008", name: "Meera Iyer",     percentage: 95 },
    { traineeUid: "t-002", name: "Priyanka Singh", percentage: 92 },
    { traineeUid: "t-001", name: "Arjun Mehta",    percentage: 88 },
  ],
  trainees: DEMO_TRAINEE_ROWS.map((t) => ({ ...t })),
  executionFlow: [
    { moduleKey: "ATTENDANCE",    label: "Attendance",    status: "Running"   as "Running" | "Completed" | "Pending", startedAt: (`${TODAY_STR} 10:00:00`) as string | null, endedAt: null as string | null, elapsedSeconds: null as number | null },
    { moduleKey: "STANDARD_TEST", label: "Standard Test", status: "Pending"   as "Running" | "Completed" | "Pending", startedAt: null as string | null,                      endedAt: null as string | null, elapsedSeconds: null as number | null },
    { moduleKey: "LIVE_QUIZ",     label: "Live Quiz",     status: "Pending"   as "Running" | "Completed" | "Pending", startedAt: null as string | null,                      endedAt: null as string | null, elapsedSeconds: null as number | null },
    { moduleKey: "SURVEY",        label: "Survey",        status: "Pending"   as "Running" | "Completed" | "Pending", startedAt: null as string | null,                      endedAt: null as string | null, elapsedSeconds: null as number | null },
  ],
  auditLog: [
    { moduleKey: "ATTENDANCE", label: "Attendance", runNumber: 1, startedAt: (`${TODAY_STR} 10:00:00`) as string | null, endedAt: null as string | null, elapsedSeconds: null as number | null, isRunning: true, startedBy: "Rajesh Kumar" as string | null },
  ],
};

// ─── Assessment Suites ────────────────────────────────────────────────────────
export const DEMO_ASSESSMENT_SUITES = [
  { assessmentSuiteUid: "suite-post-test-001", category: "POST TEST", name: "S26 Galaxy Post Test",      noOfQuestion: 10 },
  { assessmentSuiteUid: "suite-quiz-001",       category: "Quiz",      name: "Galaxy AI Live Quiz",       noOfQuestion: 5  },
  { assessmentSuiteUid: "suite-survey-001",     category: "Survey",    name: "Training Feedback Survey",  noOfQuestion: 5  },
];

// ─── MCQ Questions (Post Test / Live Quiz) ────────────────────────────────────
export const DEMO_ASSESSMENT_QUESTIONS = [
  { id: 1,  question: "Identify the INCORRECT statement about performance with Galaxy S26.",        question_type: "multiple_choice", sort_order: 1,  options: [{ id: "A", text: "Powerful 2nm Exynos 2600 Processor" },      { id: "B", text: "Larger 6.3-inch Dynamic Display" },     { id: "C", text: "Bigger 4300mAh Battery" },            { id: "D", text: "None of these" }] },
  { id: 2,  question: "Which feature is NOT part of the S26 Ultra in-store demo?",                  question_type: "multiple_choice", sort_order: 2,  options: [{ id: "A", text: "Privacy display via live demo" },            { id: "B", text: "Horizontal lock via live demo" },       { id: "C", text: "Enhanced Photo Assist via live demo" },{ id: "D", text: "AI Call screening via live demo" }] },
  { id: 3,  question: "Which Galaxy AI feature helps edit a photo after it is taken?",              question_type: "multiple_choice", sort_order: 3,  options: [{ id: "A", text: "Photo Assist" },                              { id: "B", text: "Live Translate" },                      { id: "C", text: "Now Brief" },                         { id: "D", text: "Samsung Wallet" }] },
  { id: 4,  question: "What is the battery capacity of the Samsung Galaxy S26 Ultra?",              question_type: "multiple_choice", sort_order: 4,  options: [{ id: "A", text: "4500mAh" },                                   { id: "B", text: "4800mAh" },                             { id: "C", text: "5000mAh" },                           { id: "D", text: "5500mAh" }] },
  { id: 5,  question: "Which Galaxy AI feature powers on-device productivity summaries?",           question_type: "multiple_choice", sort_order: 5,  options: [{ id: "A", text: "Now Brief" },                                 { id: "B", text: "Bixby Routine" },                       { id: "C", text: "Samsung Pass" },                      { id: "D", text: "Good Lock" }] },
  { id: 6,  question: "What display technology does the Galaxy S26 series use?",                   question_type: "multiple_choice", sort_order: 6,  options: [{ id: "A", text: "LCD" },                                       { id: "B", text: "Dynamic AMOLED 2X" },                   { id: "C", text: "Super AMOLED" },                      { id: "D", text: "OLED Pro" }] },
  { id: 7,  question: "Samsung Galaxy S26 supports which maximum wired charging speed?",            question_type: "multiple_choice", sort_order: 7,  options: [{ id: "A", text: "25W" },                                       { id: "B", text: "35W" },                                 { id: "C", text: "45W" },                               { id: "D", text: "65W" }] },
  { id: 8,  question: "Which Samsung feature enables real-time language translation during calls?", question_type: "multiple_choice", sort_order: 8,  options: [{ id: "A", text: "Chat Assist" },                               { id: "B", text: "Live Translate" },                      { id: "C", text: "Interpreter" },                       { id: "D", text: "Bixby Translate" }] },
  { id: 9,  question: "What is the S Pen pressure sensitivity in the Galaxy S26 Ultra?",           question_type: "multiple_choice", sort_order: 9,  options: [{ id: "A", text: "1024 levels" },                               { id: "B", text: "2048 levels" },                         { id: "C", text: "4096 levels" },                       { id: "D", text: "8192 levels" }] },
  { id: 10, question: "Which OS ships with the Samsung Galaxy S26 series at launch?",              question_type: "multiple_choice", sort_order: 10, options: [{ id: "A", text: "One UI 6.0 / Android 14" },                   { id: "B", text: "One UI 7.0 / Android 15" },             { id: "C", text: "One UI 8.0 / Android 16" },           { id: "D", text: "One UI 6.5 / Android 15" }] },
];

// ─── Survey Questions ─────────────────────────────────────────────────────────
export const DEMO_SURVEY_QUESTIONS = [
  { id: 101, question: "How would you rate the overall quality of today's training?",                                 question_type: "multiple_choice", sort_order: 1, options: [{ id: "A", text: "Excellent" }, { id: "B", text: "Good" }, { id: "C", text: "Average" }, { id: "D", text: "Poor" }] },
  { id: 102, question: "Was the training content relevant to your daily sales activities?",                            question_type: "multiple_choice", sort_order: 2, options: [{ id: "A", text: "Very Relevant" }, { id: "B", text: "Somewhat Relevant" }, { id: "C", text: "Neutral" }, { id: "D", text: "Not Relevant" }] },
  { id: 103, question: "How confident do you feel explaining Galaxy S26 features to a customer after this training?", question_type: "multiple_choice", sort_order: 3, options: [{ id: "A", text: "Very Confident" }, { id: "B", text: "Confident" }, { id: "C", text: "Somewhat Confident" }, { id: "D", text: "Not Confident" }] },
  { id: 104, question: "What did you find most valuable about today's training?",        question_type: "short_answer", sort_order: 4, options: [] as { id: string; text: string }[] },
  { id: 105, question: "Any suggestions to improve future training sessions?",           question_type: "short_answer", sort_order: 5, options: [] as { id: string; text: string }[] },
];

// ─── Assessment Suite Detail (used by assessment_builder) ─────────────────────
export const DEMO_SUITE_DETAIL_BASE = {
  assessmentSuiteUid: "suite-post-test-001",
  title: "S26 Galaxy Post Test",
  description: "Standard post-training assessment for Galaxy S26 product knowledge." as string | null,
  category: "POST TEST",
  testTime: "30" as string | null,
  type: "Test",
  noOfQuestion: 10,
  questions: DEMO_ASSESSMENT_QUESTIONS.map((q) => ({
    id: q.id,
    question: q.question,
    questionType: q.question_type,
    options: [...q.options] as { id: string; text: string }[],
    correctAnswer: (q.options[0]?.id ?? null) as string | null,
    points: 1,
    timerSeconds: null as number | null,
    explanation: null as string | null,
    sortOrder: q.sort_order,
  })),
};

// ─── Pending Sessions (Admin view) ────────────────────────────────────────────
export const DEMO_PENDING_SESSIONS = [
  { conferenceUid: "demo-conf-uid-pend-1", title: "SEC Plan Refresher Workshop",         trainerName: "Rajesh Kumar"  as string | null, conferenceDate: TOMORROW_STR as string | null, conferenceTime: "14:00" as string | null, status: "Scheduled" },
  { conferenceUid: "demo-conf-uid-pend-2", title: "MX Training – Partner Staff Induction", trainerName: "Ananya Reddy" as string | null, conferenceDate: TOMORROW_STR as string | null, conferenceTime: "16:00" as string | null, status: "Scheduled" },
];
