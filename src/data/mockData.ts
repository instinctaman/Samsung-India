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
  name: "Tushar Prajapati",
  phone: 9876543210 as number,
  email: "anshu.pandey@samsung.com",
  gender: "male" as string | null,
  designation: "Sales Associate" as string | null,
  employee_id: "EMP-20240001" as string | null,
  supervisorName: "Priya Sharma" as string | null,
  state: "delhi" as string | null,
  district: "new_delhi" as string | null,
  profilePhoto: null as string | null,
  status: "Active",
};

// ─── Trainer Profile ───────────────────────────────────────────────────────────
export const DEMO_TRAINER_PROFILE = {
  name: "Demo Trainer",
  email: "demotrainer@123.com",
  mobileNumber: "9877521454",
  altPhone: "9898521458",
  gender: "Male",
  dob: "06/05/2002",

  city: "New Delhi",
  district: "New Delhi",
  state: "Delhi",
  pincode: "110030",
  landmark: "SBI Bank Sultanpur Branch",
  permanentSameAsLocal: false,

  aadharNumber: "",
  aadharFile: "",
  profilePicture: "",
  about: "Please design your content",
  resume: "",
  otherDocument: "",

  facebookUsername: "",
  twitterUsername: "",
  instagramUsername: "",
  linkedinUsername: "",
  youtubeUsername: "",
  github: "",

  jobStatus: "Approved",
  joinedOn: "02/01/2025",
  role: "Trainer",
  designation: "ASM",
  salary: "",
  companyEmail: "",
  visitingCard: "",
  idCard: "",
  offerLetter: "",
  letterhead: "",
  promocode: "",

  username: "demotrainer",
  password: "",
  remarks: "",
  agreedToTerms: true,
};

// ─── New Trainee Registration (Trainer-created) ───────────────────────────────
export type NewTraineeRecord = {
  traineeUid: string;
  registeredAt: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  profilePhoto: string | null;
  agencyId: string | null;
  fullName: string;
  designation: string;
  gender: string;
  dob: string | null;
  primaryEmail: string;
  primaryPhone: string;
  altEmail: string | null;
  altPhone: string | null;
  address: string | null;
  state: string | null;
  district: string | null;
  zone: string;
  region: string;
  company: string;
  requestedBy: string;
  trainerId: string;
  trainerName: string;
  supervisorId: string;
  supervisorName: string;
  supervisorDesignation: string | null;
  joinedOn: string;
  jobStatus: string;
  jobCity: string | null;
  jobPincode: string | null;
  resignedOn: string | null;
  username: string;
  password: string;
  updatedBy: string | null;
  updationOn: string | null;
  timestamp: string | null;
};

// First 17 names/statuses mirror the reference Trainee List screenshot exactly;
// the rest pad the list out to the same "159 entries" scale.
const _seedTraineeNames: {
  name: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
}[] = [
  { name: "Amit Kumar", approvalStatus: "Approved" },
  { name: "Sumit Roy", approvalStatus: "Approved" },
  { name: "Anuj Tyagi", approvalStatus: "Approved" },
  { name: "Ankit Pandey", approvalStatus: "Approved" },
  { name: "Ishan Saxena", approvalStatus: "Approved" },
  { name: "Naveen", approvalStatus: "Approved" },
  { name: "Amit Sehgal", approvalStatus: "Pending" },
  { name: "Anand Roy", approvalStatus: "Approved" },
  { name: "Amit Kumar", approvalStatus: "Approved" },
  { name: "Aamir Khan", approvalStatus: "Pending" },
  { name: "Som Shekhar", approvalStatus: "Approved" },
  { name: "Priyanshu", approvalStatus: "Pending" },
  { name: "Praveen Kumar", approvalStatus: "Approved" },
  { name: "Sahil Khan", approvalStatus: "Approved" },
  { name: "Ch. Aman", approvalStatus: "Approved" },
  { name: "Aashish Maan", approvalStatus: "Pending" },
  { name: "Ameerul", approvalStatus: "Rejected" },
];

function _makeDemoTrainee(
  index: number,
  name: string,
  approvalStatus: "Approved" | "Pending" | "Rejected",
  overrides: Partial<NewTraineeRecord> = {},
): NewTraineeRecord {
  const n = index + 1;
  return {
    traineeUid: `demo-trainee-${String(n).padStart(3, "0")}`,
    registeredAt: "2026-07-25 09:00:00",
    approvalStatus,
    profilePhoto: null,
    agencyId: null,
    fullName: name,
    designation: "Sales Associate",
    gender: "male",
    dob: null,
    primaryEmail: `trainee${n}@samsung.com`,
    primaryPhone: `98765${String(40000 + n).slice(-5)}`,
    altEmail: null,
    altPhone: null,
    address: null,
    state: "delhi",
    district: "new_delhi",
    zone: "North",
    region: "Delhi NCR",
    company: "Samsung India",
    requestedBy: "Demo Trainer",
    trainerId: "demo-trainer-001",
    trainerName: "Demo Trainer",
    supervisorId: "demo-supervisor-001",
    supervisorName: "Priya Sharma",
    supervisorDesignation: "Regional Manager",
    joinedOn: "2026-07-25",
    jobStatus: "Active",
    jobCity: null,
    jobPincode: null,
    resignedOn: null,
    username: `trainee${n}`,
    password: "demo1234",
    updatedBy: null,
    updationOn: null,
    timestamp: null,
    ...overrides,
  };
}

// Real rows from the reference Trainee List screenshot (SL 1-9), used verbatim
// instead of synthesized filler.
const _realTraineeSeed: Partial<NewTraineeRecord>[] = [
  {
    traineeUid: "TRN26081914223765",
    fullName: "Kevil Panchal",
    primaryPhone: "9925413104",
    trainerName: "",
    supervisorName: "Bipin prajapati",
    district: "Ahmedabad",
    state: "Gujarat",
    timestamp: "2026-08-19 14:22:37",
  },
  {
    traineeUid: "TRN26081914172934",
    fullName: "Prince",
    primaryPhone: "9350393292",
    trainerName: "",
    supervisorName: "Harjeet",
    district: "Fatehabad",
    state: "Haryana",
    timestamp: "2026-08-19 14:17:29",
  },
  {
    traineeUid: "TRN26081914060237",
    fullName: "Maheshsingh chand",
    primaryPhone: "8000852006",
    trainerName: "",
    supervisorName: "AHTESAM SIR",
    district: "Vapi",
    state: "Gujarat",
    timestamp: "2026-08-19 14:06:02",
  },
  {
    traineeUid: "TRN26081914054617",
    fullName: "Khushbu",
    primaryPhone: "7698217549",
    trainerName: "",
    supervisorName: "Mahesh chand",
    district: "Vapi",
    state: "Gujarat",
    timestamp: "2026-08-19 14:05:46",
  },
  {
    traineeUid: "TRN26081914035127",
    fullName: "Uwais pathan",
    primaryPhone: "9054985127",
    trainerName: "",
    supervisorName: "Maheah Chand",
    district: "Vapi",
    state: "Gujarat",
    timestamp: "2026-08-19 14:03:51",
  },
  {
    traineeUid: "TRN26081914014493",
    fullName: "VIVEK SIngh",
    primaryPhone: "9104068023",
    trainerName: "",
    supervisorName: "Mahesh chand",
    district: "Vapi",
    state: "Gujarat",
    timestamp: "2026-08-19 14:01:44",
  },
  {
    traineeUid: "TRN26081912410825",
    fullName: "Komal",
    primaryPhone: "6399897617",
    trainerName: "",
    supervisorName: "Pankaj kumar",
    district: "Dehradun",
    state: "Uttarakhand",
    timestamp: "2026-08-19 12:41:08",
  },
  {
    traineeUid: "TRN26081912325891",
    fullName: "Nihal Anand",
    primaryPhone: "7992210715",
    trainerName: "",
    supervisorName: "Manoj Bisht",
    district: "Gurgaon Training Centre",
    state: "Haryana",
    timestamp: "2026-08-19 12:32:58",
  },
  {
    traineeUid: "TRN26081912303393",
    fullName: "Deependra Meena",
    primaryPhone: "7300059090",
    trainerName: "",
    supervisorName: "Manoj Bisht",
    district: "Gurgaon Training Centre",
    state: "Haryana",
    timestamp: "2026-08-19 12:30:33",
  },
];

const TRAINEE_LIST_TOTAL = 159;

export const DEMO_REGISTERED_TRAINEES: NewTraineeRecord[] = [
  ..._realTraineeSeed.map((overrides, i) =>
    _makeDemoTrainee(i, overrides.fullName!, "Approved", overrides),
  ),
  ...Array.from(
    { length: TRAINEE_LIST_TOTAL - _realTraineeSeed.length },
    (_, i) => {
      const seed = _seedTraineeNames[i % _seedTraineeNames.length];
      return _makeDemoTrainee(
        _realTraineeSeed.length + i,
        seed.name,
        seed.approvalStatus,
      );
    },
  ),
];

export const DEMO_AUTH_SESSION = {
  access_token: "demo-access-token-trainee",
  token_type: "bearer",
  trainee: { ...DEMO_TRAINEE },
};

// ─── Admin / Trainer ──────────────────────────────────────────────────────────
export const DEMO_ADMIN_TRAINER = {
  username: "trainer1",
  name: "Rajesh Kumar",
  role: "trainer",
};
export const DEMO_ADMIN_ADMIN = {
  username: "admin",
  name: "Priya Sharma",
  role: "admin",
};

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
  title: "Training Session",
  sessionType: "One-Day Session" as string | null,
  date: "06 Jun 2026" as string | null,
  location: "New Delhi" as string | null,
  trainerName: "Rajesh Kumar" as string | null,
  confirmationStatus: "Not Confirmed",
  started: true,
  startsAt: "09:00 AM" as string | null,
  attendanceGeoFencing: true,
  modules: [
    {
      key: "ATTENDANCE" as
        | "ATTENDANCE"
        | "STANDARD_TEST"
        | "LIVE_QUIZ"
        | "SURVEY",
      name: "ATTENDANCE",
      time: "09:00" as string | null,
      endTime: "10:00" as string | null,
      duration: "1h" as string | null,
      isLive: true,
      isCompleted: false,
      isMissed: false,
      completedAt: null as string | null,
      score: null as string | null,
      ranDuration: null as string | null,
      assessmentSuiteUid: null as string | null,
    },
    {
      key: "LIVE_QUIZ" as
        | "ATTENDANCE"
        | "STANDARD_TEST"
        | "LIVE_QUIZ"
        | "SURVEY",
      name: "QUIZ",
      time: "10:00" as string | null,
      endTime: "12:00" as string | null,
      duration: "2h" as string | null,
      isLive: false,
      isCompleted: false,
      isMissed: false,
      completedAt: null as string | null,
      score: null as string | null,
      ranDuration: "Ran : 1h 55m" as string | null,
      assessmentSuiteUid: "suite-quiz-001" as string | null,
    },
    {
      key: "STANDARD_TEST" as
        | "ATTENDANCE"
        | "STANDARD_TEST"
        | "LIVE_QUIZ"
        | "SURVEY",
      name: "POST TEST",
      time: "12:00" as string | null,
      endTime: "14:00" as string | null,
      duration: "2h" as string | null,
      isLive: false,
      isCompleted: false,
      isMissed: false,
      completedAt: null as string | null,
      score: null as string | null,
      ranDuration: null as string | null,
      assessmentSuiteUid: "suite-post-test-001" as string | null,
    },
    {
      key: "SURVEY" as "ATTENDANCE" | "STANDARD_TEST" | "LIVE_QUIZ" | "SURVEY",
      name: "SURVEY",
      time: "14:00" as string | null,
      endTime: "16:00" as string | null,
      duration: "2h" as string | null,
      isLive: false,
      isCompleted: false,
      isMissed: false,
      completedAt: null as string | null,
      score: null as string | null,
      ranDuration: null as string | null,
      assessmentSuiteUid: "suite-survey-001" as string | null,
    },
  ],
};

// ─── Session History (Trainee) ────────────────────────────────────────────────
export const DEMO_SESSION_HISTORY = [
  {
    conferenceUid: "hist-conf-001",
    title: "Samsung Galaxy S25 Flagship Training",
    date: "2026-07-10" as string | null,
    trainerName: "Sunita Patel" as string | null,
    attendanceStatus: "Present" as string | null,
    score: "88%" as string | null,
    passed: true as boolean | null,
  },
  {
    conferenceUid: "hist-conf-002",
    title: "Samsung Smart Home Ecosystem Workshop",
    date: "2026-06-22" as string | null,
    trainerName: "Vikram Nair" as string | null,
    attendanceStatus: "Present" as string | null,
    score: "72%" as string | null,
    passed: true as boolean | null,
  },
  {
    conferenceUid: "hist-conf-003",
    title: "Galaxy AI Features Deep Dive",
    date: "2026-05-18" as string | null,
    trainerName: "Ananya Reddy" as string | null,
    attendanceStatus: "Present" as string | null,
    score: "56%" as string | null,
    passed: false as boolean | null,
  },
];

// ─── Trainer Agenda ───────────────────────────────────────────────────────────
type DemoAgendaItem = {
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

export const DEMO_AGENDA: DemoAgendaItem[] = [
  {
    conferenceUid: "CONF2608R7",
    title: "Classroom Training – Thane",
    trainerName: "Akash Kumar Jayaswal",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Maharashtra",
    trainingHub: "Thane",
    totalPax: 0,
    hoid: "GS20358625",
    venueName: "Not Available",
    district: "Thane",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 12:58:14",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R16",
    title: "Classroom Training – Andheri",
    trainerName: "Eric Keki Patel",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Maharashtra",
    trainingHub: "Mumbai",
    totalPax: 0,
    hoid: "QS2524671",
    venueName: "Not Available",
    district: "Andheri",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 11:20:56",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R23",
    title: "Classroom Training – Borivali",
    trainerName: "Jyotsana Gaurav Tiwari",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Maharashtra",
    trainingHub: "Mumbai",
    totalPax: 0,
    hoid: "2004009042",
    venueName: "Not Available",
    district: "Borivali",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 12:34:20",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R39",
    title: "Classroom Training – Ahmedabad",
    trainerName: "Tiwari Dharmesh",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Gujarat",
    trainingHub: "Ahmedabad",
    totalPax: 0,
    hoid: "2004009044",
    venueName: "Not Available",
    district: "Ahmedabad",
    updatedBy: "AGT001",
    updationOn: "2026-08-19 09:14:35",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R49",
    title: "Classroom Training – Godhra",
    trainerName: "Kiritkumar Makwana",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Gujarat",
    trainingHub: "Godhra",
    totalPax: 0,
    hoid: "QS3050506",
    venueName: "Not Available",
    district: "Godhra",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 12:48:25",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R70",
    title: "Classroom Training – Vapi",
    trainerName: "Pragya Mishra",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Scheduled",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Gujarat",
    trainingHub: "Vapi",
    totalPax: 0,
    hoid: "GS20325918",
    venueName: "Not Available",
    district: "Vapi",
    updatedBy: "2002093968",
    updationOn: "2026-08-18 07:36:24",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R96",
    title: "Classroom Training – Nashik",
    trainerName: "Mohammad Minhajuddin Mohammad Rafeequddin",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Maharashtra",
    trainingHub: "Maharashtra",
    totalPax: 0,
    hoid: "QS2524685",
    venueName: "Not Available",
    district: "Nashik",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 12:24:52",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R107",
    title: "Classroom Training – Solapur",
    trainerName: "Mahesh Vishwas Gadgil",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Maharashtra",
    trainingHub: "Maharashtra",
    totalPax: 0,
    hoid: "QS2524684",
    venueName: "Not Available",
    district: "Solapur",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 12:45:57",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608R128",
    title: "Classroom Training – Korba",
    trainerName: "Dinesh Singh Rathore",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Chhattisgarh",
    trainingHub: "Chhattisgarh",
    totalPax: 0,
    hoid: "GS20187880",
    venueName: "Not Available",
    district: "Korba",
    updatedBy: "2002093968",
    updationOn: "2026-08-19 12:49:04",
    timestamp: "2026-08-10 05:45:23",
  },
  {
    conferenceUid: "CONF2608M6",
    title: "Classroom Training – Bhubaneswar",
    trainerName: "Shashi Kumar Choudhary",
    conferenceDate: TODAY_STR,
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    location: null,
    batchSize: null,
    trainingType: "Classroom Training",
    state: "Odisha",
    trainingHub: "Bhubaneswar",
    totalPax: 0,
    hoid: "QS2524681",
    venueName: "Not Available",
    district: "Bhubaneswar",
    updatedBy: "2003198148",
    updationOn: "2026-08-19 11:50:59",
    timestamp: "2026-08-10 05:45:23",
  },
];

// ─── Attendance List (Admin-wide candidate report) ───────────────────────────
type DemoAttendanceItem = {
  attendanceId: string;
  region: string | null;
  product: string | null;
  session: string | null;
  audienceType: string | null;
  conferenceDate: string | null;
  trainerName: string | null;
  trainerHoId: string | null;
  participantHoId: string | null;
  participantName: string;
  phone: string | null;
  state: string | null;
  location: string | null;
  reportingManagerOfPromoter: string | null;
  attendanceStatus: string;
  checkIn: string | null;
  checkOut: string | null;
  postTestScore: string | null;
  postTestScoreSummary: string | null;
  sessionTypeMethod: string | null;
  conferenceId: string | null;
  lastUpdates: string | null;
};

function _makeDemoAttendance(overrides: {
  attendanceId: string;
  participantHoId: string;
  participantName: string;
  phone: string;
  location: string;
  score: number;
  total: number;
  lastUpdates: string;
}): DemoAttendanceItem {
  const {
    attendanceId,
    participantHoId,
    participantName,
    phone,
    location,
    score,
    total,
    lastUpdates,
  } = overrides;
  const percentage = Math.round((score / total) * 10000) / 100;
  return {
    attendanceId,
    region: "East 1",
    product: "Classroom Training",
    session: "SEC-MX-CT",
    audienceType: "SEC/ASE",
    conferenceDate: TODAY_STR,
    trainerName: "Gurpreet Gill",
    trainerHoId: "2002035880",
    participantHoId,
    participantName,
    phone,
    state: "West Bengal",
    location,
    reportingManagerOfPromoter: null,
    attendanceStatus: "Present",
    checkIn: "09:41:05",
    checkOut: null,
    postTestScore: `${score} / ${total} (${percentage}%)`,
    postTestScoreSummary: `Total: ${total}, Correct: ${score}, Wrong: ${total - score}`,
    sessionTypeMethod: "SEC-MX-CT",
    conferenceId: "CONF2608M86",
    lastUpdates,
  };
}

export const DEMO_ATTENDANCE_LIST: DemoAttendanceItem[] = [
  _makeDemoAttendance({
    attendanceId: "EXATD26081909413949",
    participantHoId: "EAST105149",
    participantName: "Ratikanta Samanta",
    phone: "6295802519",
    location: "Mecheda",
    score: 21,
    total: 30,
    lastUpdates: "2026-08-19 14:15:38",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909414666",
    participantHoId: "EASTL62494",
    participantName: "Surajit Jana",
    phone: "7059965483",
    location: "Midnapur City",
    score: 24,
    total: 30,
    lastUpdates: "2026-08-19 14:18:40",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909415294",
    participantHoId: "EAST114259",
    participantName: "Kanchan Bhoumik",
    phone: "7431088361",
    location: "Daspur",
    score: 21,
    total: 30,
    lastUpdates: "2026-08-19 14:16:13",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909415220",
    participantHoId: "EAST120900",
    participantName: "Madhurima Das",
    phone: "9875587359",
    location: "Nandigram",
    score: 28,
    total: 30,
    lastUpdates: "2026-08-19 14:15:08",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909415670",
    participantHoId: "EAST124311",
    participantName: "Chandam Mondal",
    phone: "8116207429",
    location: "Ghatal",
    score: 17,
    total: 30,
    lastUpdates: "2026-08-19 14:19:06",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909415734",
    participantHoId: "EAST55360",
    participantName: "Sekh Firojuddin",
    phone: "7980745702",
    location: "Howrah",
    score: 26,
    total: 30,
    lastUpdates: "2026-08-19 14:20:19",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909420194",
    participantHoId: "EAST71502",
    participantName: "Atanu Khanra",
    phone: "7430008317",
    location: "Midnapur City",
    score: 19,
    total: 30,
    lastUpdates: "2026-08-19 14:17:03",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909420327",
    participantHoId: "EAST22144",
    participantName: "Surjya Sankar Banerjee",
    phone: "7076837611",
    location: "Haldia",
    score: 26,
    total: 30,
    lastUpdates: "2026-08-19 14:22:14",
  }),
  _makeDemoAttendance({
    attendanceId: "EXATD26081909420493",
    participantHoId: "EAST5093",
    participantName: "Suman Roy",
    phone: "8017072818",
    location: "Howrah",
    score: 25,
    total: 30,
    lastUpdates: "2026-08-19 14:17:30",
  }),
];

// ─── Session Dashboard — Trainee Rows ────────────────────────────────────────
export const DEMO_TRAINEE_ROWS = [
  {
    traineeUid: "t-001",
    name: "Arjun Mehta",
    phone: 9876543210 as number | null,
    status: "Present",
    markedOn: `${TODAY_STR} 10:12:00` as string | null,
    checkOutTime: null as string | null,
    score: "88%" as string | null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-002",
    name: "Priyanka Singh",
    phone: 9876543211 as number | null,
    status: "Present",
    markedOn: `${TODAY_STR} 10:08:00` as string | null,
    checkOutTime: null as string | null,
    score: "92%" as string | null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-003",
    name: "Rahul Sharma",
    phone: 9876543212 as number | null,
    status: "Present",
    markedOn: `${TODAY_STR} 10:15:00` as string | null,
    checkOutTime: null as string | null,
    score: "76%" as string | null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-004",
    name: "Sunita Patel",
    phone: 9876543213 as number | null,
    status: "Absent",
    markedOn: null,
    checkOutTime: null as string | null,
    score: null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-005",
    name: "Vikram Nair",
    phone: 9876543214 as number | null,
    status: "Present",
    markedOn: `${TODAY_STR} 10:05:00` as string | null,
    checkOutTime: null as string | null,
    score: "84%" as string | null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-006",
    name: "Ananya Reddy",
    phone: 9876543215 as number | null,
    status: "Present",
    markedOn: `${TODAY_STR} 10:10:00` as string | null,
    checkOutTime: null as string | null,
    score: null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-007",
    name: "Karan Joshi",
    phone: 9876543216 as number | null,
    status: "Not Marked",
    markedOn: null,
    checkOutTime: null as string | null,
    score: null,
    profilePhoto: null as string | null,
  },
  {
    traineeUid: "t-008",
    name: "Meera Iyer",
    phone: 9876543217 as number | null,
    status: "Present",
    markedOn: `${TODAY_STR} 10:18:00` as string | null,
    checkOutTime: null as string | null,
    score: "95%" as string | null,
    profilePhoto: null as string | null,
  },
];

// ─── Session Dashboard (Trainer view) ────────────────────────────────────────
export const DEMO_SESSION_DASHBOARD = {
  conferenceUid: "demo-conf-uid-main",
  title: "Samsung Galaxy S26 Product Training",
  trainingType: "Product Training" as string | null,
  conferenceDate: TODAY_STR as string | null,
  conferenceTime: "10:00" as string | null,
  trainerName: "Rajesh Kumar" as string | null,
  location: "Samsung Training Hub, New Delhi" as string | null,
  conferenceStatus: "Ongoing",
  approvalStatus: "Approved",
  activeModuleId: "ATTENDANCE" as string | null,
  actualStartedAt: `${TODAY_STR} 10:00:00` as string | null,
  actualEndedAt: null as string | null,
  runtimeSeconds: 2400 as number | null,
  audience: { total: 8, present: 5 },
  assessment: { pass: 4, fail: 1, totalAttempts: 5 },
  topPerformers: [
    { traineeUid: "t-008", name: "Meera Iyer", percentage: 95 },
    { traineeUid: "t-002", name: "Priyanka Singh", percentage: 92 },
    { traineeUid: "t-001", name: "Arjun Mehta", percentage: 88 },
  ],
  trainees: DEMO_TRAINEE_ROWS.map((t) => ({ ...t })),
  executionFlow: [
    {
      moduleKey: "ATTENDANCE",
      label: "Attendance",
      status: "Completed" as "Running" | "Completed" | "Pending",
      startedAt: `${TODAY_STR} 10:00:00` as string | null,
      endedAt: `${TODAY_STR} 10:50:25` as string | null,
      elapsedSeconds: 3025 as number | null,
      assignedMinutes: 30 as number | null,
    },
    {
      moduleKey: "LIVE_QUIZ",
      label: "Live Quiz",
      status: "Running" as "Running" | "Completed" | "Pending",
      startedAt: `${TODAY_STR} 10:51:00` as string | null,
      endedAt: null as string | null,
      elapsedSeconds: null as number | null,
      assignedMinutes: 30 as number | null,
    },
    {
      moduleKey: "STANDARD_TEST",
      label: "Standard Test",
      status: "Pending" as "Running" | "Completed" | "Pending",
      startedAt: null as string | null,
      endedAt: null as string | null,
      elapsedSeconds: null as number | null,
      assignedMinutes: 30 as number | null,
    },
    {
      moduleKey: "SURVEY",
      label: "Survey",
      status: "Pending" as "Running" | "Completed" | "Pending",
      startedAt: null as string | null,
      endedAt: null as string | null,
      elapsedSeconds: null as number | null,
      assignedMinutes: 30 as number | null,
    },
  ],
  auditLog: [
    {
      moduleKey: "ATTENDANCE",
      label: "Attendance",
      runNumber: 1,
      startedAt: `${TODAY_STR} 10:00:00` as string | null,
      endedAt: null as string | null,
      elapsedSeconds: null as number | null,
      isRunning: true,
      startedBy: "Rajesh Kumar" as string | null,
    },
  ],
};

// ─── Assessment Suites ────────────────────────────────────────────────────────
export const DEMO_ASSESSMENT_SUITES = [
  {
    assessmentSuiteUid: "suite-post-test-001",
    category: "POST TEST",
    name: "S26 Galaxy Post Test",
    noOfQuestion: 10,
  },
  {
    assessmentSuiteUid: "suite-quiz-001",
    category: "Quiz",
    name: "Galaxy AI Live Quiz",
    noOfQuestion: 4,
  },
  {
    assessmentSuiteUid: "suite-survey-001",
    category: "Survey",
    name: "Training Feedback Survey",
    noOfQuestion: 5,
  },
];

// ─── MCQ Questions (Post Test / Live Quiz) ────────────────────────────────────
export const DEMO_ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question:
      "Identify the INCORRECT statement about performance with Galaxy S26.",
    question_type: "multiple_choice",
    sort_order: 1,
    correctAnswer: "A",
    explanation:
      "The Galaxy S26 is not equipped with the Exynos 2600. It uses the Snapdragon 8 Gen 4 Chipset.",
    options: [
      { id: "A", text: "Powerful 2nm Exynos 2600 Processor" },
      { id: "B", text: "Larger 6.3-inch Dynamic Display" },
      { id: "C", text: "Bigger 4300mAh Battery" },
      { id: "D", text: "None of these" },
    ],
  },
  {
    id: 2,
    question: "Which of the following is NOT part of S26 Ultra In-store demo?",
    question_type: "multiple_choice",
    sort_order: 2,
    correctAnswer: "D",
    explanation:
      "The Galaxy S26 is not equipped with the Exynos 2600. It uses the Snapdragon 8 Gen 4 Chipset.",
    options: [
      { id: "A", text: "Privacy display via live demo" },
      { id: "B", text: "Horizontal lock via live demo" },
      { id: "C", text: "Enhanced Photo Assist via live demo" },
      { id: "D", text: "AI Call screening via live demo" },
    ],
  },
  {
    id: 3,
    question: "Which Galaxy AI feature helps edit a photo after it is taken?",
    question_type: "multiple_choice",
    sort_order: 3,
    correctAnswer: "A",
    explanation:
      "Photo Assist offers AI generative editing tools to move, resize, or delete objects in photos.",
    options: [
      { id: "A", text: "Photo Assist" },
      { id: "B", text: "Live Translate" },
      { id: "C", text: "Now Brief" },
      { id: "D", text: "Samsung Wallet" },
    ],
  },
  {
    id: 4,
    question: "What is the battery capacity of the Samsung Galaxy S26 Ultra?",
    question_type: "multiple_choice",
    sort_order: 4,
    correctAnswer: "C",
    explanation:
      "The Galaxy S26 Ultra features a robust 5000mAh all-day intelligent battery.",
    options: [
      { id: "A", text: "4500mAh" },
      { id: "B", text: "4800mAh" },
      { id: "C", text: "5000mAh" },
      { id: "D", text: "5500mAh" },
    ],
  },
  {
    id: 5,
    question:
      "Which Galaxy AI feature powers on-device productivity summaries?",
    question_type: "multiple_choice",
    sort_order: 5,
    correctAnswer: "A",
    explanation:
      "Now Brief aggregates summaries and upcoming schedules directly on your screen.",
    options: [
      { id: "A", text: "Now Brief" },
      { id: "B", text: "Bixby Routine" },
      { id: "C", text: "Samsung Pass" },
      { id: "D", text: "Good Lock" },
    ],
  },
  {
    id: 6,
    question: "What display technology does the Galaxy S26 series use?",
    question_type: "multiple_choice",
    sort_order: 6,
    correctAnswer: "B",
    explanation:
      "The Galaxy S26 series utilizes Dynamic AMOLED 2X displays with up to 120Hz adaptive refresh rate.",
    options: [
      { id: "A", text: "LCD" },
      { id: "B", text: "Dynamic AMOLED 2X" },
      { id: "C", text: "Super AMOLED" },
      { id: "D", text: "OLED Pro" },
    ],
  },
  {
    id: 7,
    question: "Samsung Galaxy S26 supports which maximum wired charging speed?",
    question_type: "multiple_choice",
    sort_order: 7,
    correctAnswer: "C",
    explanation: "Galaxy S26 supports up to 45W Super Fast Charging 2.0.",
    options: [
      { id: "A", text: "25W" },
      { id: "B", text: "35W" },
      { id: "C", text: "45W" },
      { id: "D", text: "65W" },
    ],
  },
  {
    id: 8,
    question:
      "Which Samsung feature enables real-time language translation during calls?",
    question_type: "multiple_choice",
    sort_order: 8,
    correctAnswer: "B",
    explanation:
      "Live Translate delivers two-way voice and text translations in real time during phone calls.",
    options: [
      { id: "A", text: "Chat Assist" },
      { id: "B", text: "Live Translate" },
      { id: "C", text: "Interpreter" },
      { id: "D", text: "Bixby Translate" },
    ],
  },
  {
    id: 9,
    question: "What is the S Pen pressure sensitivity in the Galaxy S26 Ultra?",
    question_type: "multiple_choice",
    sort_order: 9,
    correctAnswer: "C",
    explanation:
      "The integrated S Pen provides 4096 levels of precise pressure sensitivity.",
    options: [
      { id: "A", text: "1024 levels" },
      { id: "B", text: "2048 levels" },
      { id: "C", text: "4096 levels" },
      { id: "D", text: "8192 levels" },
    ],
  },
  {
    id: 10,
    question: "Which OS ships with the Samsung Galaxy S26 series at launch?",
    question_type: "multiple_choice",
    sort_order: 10,
    correctAnswer: "B",
    explanation:
      "The Samsung Galaxy S26 series debuts with One UI 7.0 based on Android 15.",
    options: [
      { id: "A", text: "One UI 6.0 / Android 14" },
      { id: "B", text: "One UI 7.0 / Android 15" },
      { id: "C", text: "One UI 8.0 / Android 16" },
      { id: "D", text: "One UI 6.5 / Android 15" },
    ],
  },
];

// ─── Survey Questions ─────────────────────────────────────────────────────────
export const DEMO_SURVEY_QUESTIONS = [
  {
    id: 101,
    question: "How would you rate the June Activity-led classroom session?",
    question_type: "multiple_choice",
    sort_order: 1,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 102,
    question:
      "How effective is K.C.D. approach for Sales pitch practice & recall?",
    question_type: "multiple_choice",
    sort_order: 2,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 103,
    question:
      "How effective was the activity to use Galaxy AI features to create Team Name, Anthem & Logo?",
    question_type: "multiple_choice",
    sort_order: 3,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 104,
    question:
      "How effective was the 'Samsung Dangal' activity to practice countering competition?",
    question_type: "multiple_choice",
    sort_order: 4,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 105,
    question:
      "How effective is Activity-led training sessions vs. regular training session?",
    question_type: "multiple_choice",
    sort_order: 5,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 106,
    question:
      "How clear and engaging was the trainer's explanation of new features?",
    question_type: "multiple_choice",
    sort_order: 6,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 107,
    question:
      "How confident do you feel applying these learnings on the sales floor?",
    question_type: "multiple_choice",
    sort_order: 7,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 108,
    question:
      "How satisfied are you with the interactive demo units and learning materials provided?",
    question_type: "multiple_choice",
    sort_order: 8,
    options: [
      { id: "A", text: "Very Effective" },
      { id: "B", text: "Effective" },
      { id: "C", text: "Neutral" },
      { id: "D", text: "Ineffective" },
      { id: "E", text: "Very Ineffective" },
    ],
  },
  {
    id: 109,
    question: "What do you like most about the trainer?",
    question_type: "short_answer",
    sort_order: 9,
    options: [] as { id: string; text: string }[],
  },
  {
    id: 110,
    question: "Additional Comments",
    question_type: "short_answer",
    sort_order: 10,
    options: [] as { id: string; text: string }[],
  },
];

// ─── Assessment Suite Detail (used by assessment_builder) ─────────────────────
export const DEMO_SUITE_DETAIL_BASE = {
  assessmentSuiteUid: "suite-post-test-001",
  title: "S26 Galaxy Post Test",
  description:
    "Standard post-training assessment for Galaxy S26 product knowledge." as
      | string
      | null,
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
  {
    conferenceUid: "demo-conf-uid-pend-1",
    title: "SEC Plan Refresher Workshop",
    trainerName: "Rajesh Kumar" as string | null,
    conferenceDate: TOMORROW_STR as string | null,
    conferenceTime: "14:00" as string | null,
    status: "Scheduled",
  },
  {
    conferenceUid: "demo-conf-uid-pend-2",
    title: "MX Training – Partner Staff Induction",
    trainerName: "Ananya Reddy" as string | null,
    conferenceDate: TOMORROW_STR as string | null,
    conferenceTime: "16:00" as string | null,
    status: "Scheduled",
  },
];

// ─── Session Report — Participant Details ────────────────────────────────────
const _seedReportParticipants: {
  name: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  score: string;
}[] = [
  {
    name: "Abhay Kumar Upadhyay",
    userId: "WEST12590",
    checkIn: "09:30 AM",
    checkOut: "11:00 AM",
    score: "95%",
  },
  {
    name: "Ajit Patel",
    userId: "WEST12594",
    checkIn: "09:32 AM",
    checkOut: "11:02 AM",
    score: "92%",
  },
  {
    name: "Arbaz Altaf",
    userId: "WEST12440",
    checkIn: "09:33 AM",
    checkOut: "11:02 AM",
    score: "90%",
  },
  {
    name: "Archit Kumar Singh",
    userId: "WEST12020",
    checkIn: "09:34 AM",
    checkOut: "11:04 AM",
    score: "90%",
  },
  {
    name: "Ashutosh Singh Patel",
    userId: "WEST12587",
    checkIn: "09:34 AM",
    checkOut: "11:05 AM",
    score: "83%",
  },
  {
    name: "Kartik Lakshmikant Vyavhare",
    userId: "WEST12456",
    checkIn: "09:38 AM",
    checkOut: "11:07 AM",
    score: "74%",
  },
  {
    name: "Aditya Kumar Dhir",
    userId: "WEST12142",
    checkIn: "09:40 AM",
    checkOut: "11:09 AM",
    score: "81%",
  },
  {
    name: "Chirag Sharma Dyervanshi",
    userId: "WEST12585",
    checkIn: "09:41 AM",
    checkOut: "11:14 AM",
    score: "79%",
  },
  {
    name: "Pankaj Kumar Patel",
    userId: "WEST12499",
    checkIn: "09:41 AM",
    checkOut: "11:14 AM",
    score: "75%",
  },
  {
    name: "Preeti Kashyap Rawat",
    userId: "WEST12585",
    checkIn: "09:43 AM",
    checkOut: "11:15 AM",
    score: "65%",
  },
];

export type SessionReportParticipant = {
  userId: string;
  name: string;
  role: string;
  checkIn: string;
  checkOut: string;
  score: string;
};

const SESSION_REPORT_PARTICIPANT_TOTAL = 30;

export const DEMO_SESSION_REPORT_PARTICIPANTS: SessionReportParticipant[] =
  Array.from({ length: SESSION_REPORT_PARTICIPANT_TOTAL }, (_, i) => {
    const seed = _seedReportParticipants[i % _seedReportParticipants.length];
    return { ...seed, role: "Participant" };
  });

export const DEMO_SESSION_REPORT_SUMMARY = {
  conferenceId: "CON-2026-00098",
  sessionName: "MX Training Online Test",
  date: "07-July 2026",
  state: "Uttar Pradesh",
  schedule: "07 Jul 2026, 09:30 AM",
  duration: "01:30 Hrs (09:30 - 11:00)",
  venueLink:
    "https://tecsoul.com/meeting/session-window-setup?room=CON-2026-00098&state=UP",
};
