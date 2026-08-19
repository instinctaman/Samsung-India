/**
 * useAddTrainingForm Hook
 * Manages the multi-step add training form state, date/time pickers, dynamic
 * assessment suites fetching, sequence validation, and training creation submission.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import {
  ApiError,
  AssessmentSuiteOut,
  createTraining,
  fetchAssessmentSuites,
  ModuleConfig,
} from "@/api/training";
import { SelectOption } from "@/components/ui/SearchableSelect";
import { STATES } from "@/data/states";

export const REGIONS_BY_ZONE: Record<string, string[]> = {
  "North Zone": ["North 1", "North 2", "North 3", "North 4"],
  "South Zone": [
    "South 1",
    "South 2",
    "South 3",
    "South 4",
    "South 1 [KR]",
    "South 1 [TN]",
  ],
  "East Zone": ["East 1", "East 2", "East 3", "East 4"],
  "West Zone": ["West 1", "West 2", "West 3", "West 4"],
};
export const ZONES = Object.keys(REGIONS_BY_ZONE);

export const REQUESTED_BY_OPTIONS: SelectOption[] = [
  { label: "Quess Corp Ltd", value: "Quess Corp Ltd" },
  { label: "Other", value: "Other" },
];

export const TRAINER_OPTIONS: SelectOption[] = [
  { label: "2002641904 - Bejoyendra Kolay", value: "2002641904" },
  { label: "2002035871 - Bharat Kumar Vaswani", value: "2002035871" },
  { label: "GS20356576 - Bharath Jain", value: "GS20356576" },
  { label: "2003932855 - CHAGI VARAPRASAD", value: "2003932855" },
  { label: "9646499023 - CHANDAN SHARMA", value: "9646499023" },
  { label: "2003907196 - CHETHAN KUMAR R", value: "2003907196" },
  { label: "GS20402359 - CHINMAYA K", value: "GS20402359" },
  { label: "AGTM2620011 - Demo Trainer", value: "demotrainer" },
  { label: "2003250416 - Devendra Kumar", value: "2003250416" },
  { label: "2003628340 - Dharmeshkumar Patel", value: "2003628340" },
  { label: "2003385218 - Dinesh Singh Rathore", value: "2003385218" },
  { label: "2002035876 - Eric Keki Patel", value: "2002035876" },
  { label: "9562267076 - FIRDOUS FAYAS", value: "9562267076" },
  { label: "7259635514 - Gajendra", value: "7259635514" },
  { label: "9585478000 - GANESH", value: "9585478000" },
];

export const TRAINING_HUB_OPTIONS: SelectOption[] = [
  "Delhi",
  "Not Assigned",
  "BOLPUR",
  "ALIPURDUAR",
  "BONGAIGAON",
  "BAHARAMPUR",
].map((v) => ({ label: v, value: v }));

export const AUDIENCE_OPTIONS: SelectOption[] = [
  "PC Training",
  "SEC Plan",
  "SEC",
  "SEC LITE GT",
  "OT SEC",
  "FESTIVE SEC",
  "SGC",
].map((v) => ({ label: v, value: v }));

export const SESSION_TYPE_OPTIONS: SelectOption[] = [
  "Classroom Training",
  "PC Training",
  "MX Training",
  "ASE and ZSE",
  "Sales Team",
  "Partner Staff",
  "NHIT",
].map((v) => ({ label: v, value: v }));

export const TRAINING_TYPE_OPTIONS: SelectOption[] = [
  "Product Training",
  "Classroom Training",
  "Webinar",
].map((v) => ({
  label: v,
  value: v,
}));

export const CHECKLIST_OPTIONS = [
  "Hall",
  "Projector",
  "Microphone Set",
  "Attendance Sheet",
  "Feedback Forms",
  "ID Cards",
  "Refreshments",
  "Banner/Standee",
];

export const UNLOCK_CONDITIONS = ["Automatic", "Manual Broadcast"];

export const DEFAULT_CATEGORY_OPTIONS: SelectOption[] = [
  "POST TEST",
  "SAMSUMG S25",
  "Survey",
  "Quiz",
].map((v) => ({
  label: v,
  value: v,
}));

export const DEFAULT_QUESTION_SET_OPTIONS: Record<string, SelectOption[]> = {
  "POST TEST": [
    "S26 Review meeting",
    "Samsung Test 1",
    "Samsung Test 2",
    "MX-Training Offline Post Training For June 26",
    "Laptop Classroom/Webinar: Post Test June 26",
    "MX-Training Offline Post Test (July'26)",
    "Laptop Classroom/Webinar: Post Test July'26",
  ].map((name) => ({ label: name, value: `default:${name}` })),
};

export type ModuleKey = "standardTest" | "liveQuiz" | "survey";
export const MODULE_LABELS: Record<ModuleKey, string> = {
  standardTest: "Standard Test",
  liveQuiz: "Live Quiz (FFF)",
  survey: "Survey",
};

export const MODULE_ICONS: Record<ModuleKey, keyof typeof Ionicons.glyphMap> = {
  standardTest: "document-text",
  liveQuiz: "flash",
  survey: "happy",
};

export type EvaluationModuleState = Omit<ModuleConfig, "questionCount"> & {
  enabled: boolean;
  questionCount: string;
};

const emptyModule = (): EvaluationModuleState => ({
  enabled: false,
  checkIn: true,
  unlockCondition: "Automatic",
  questionCount: "",
});

function parseTimeToMinutes(value: string): number | null {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(match[2]);
}

const toPayloadModule = (state: EvaluationModuleState): ModuleConfig => ({
  category: state.category,
  assessmentSuiteUid: state.assessmentSuiteUid,
  questionCount: state.questionCount ? Number(state.questionCount) : undefined,
  startTime: state.startTime,
  endTime: state.endTime,
  checkIn: state.checkIn,
  unlockCondition: state.unlockCondition,
});

export function useAddTrainingForm() {
  const router = useRouter();
  const { adminToken, adminLogout } = useAuth();

  const [zone, setZone] = useState("");
  const [region, setRegion] = useState("");
  const [company, setCompany] = useState("Samsung India");
  const [requestedByOption, setRequestedByOption] = useState("");
  const [requestedByOther, setRequestedByOther] = useState("");

  const [trainerId, setTrainerId] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [district, setDistrict] = useState("");
  const [venue, setVenue] = useState("");

  const [isResidential, setIsResidential] = useState(false);
  const [conferenceDate, setConferenceDate] = useState("");
  const [conferenceTime, setConferenceTime] = useState("");
  const [trainingHub, setTrainingHub] = useState("");
  const [audience, setAudience] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [batchSize, setBatchSize] = useState("");

  const [attendanceEnabled, setAttendanceEnabled] = useState(true);
  const [checkInOpens, setCheckInOpens] = useState("");
  const [checkOutCloses, setCheckOutCloses] = useState("");
  const [geoFencing, setGeoFencing] = useState(true);

  const [modules, setModules] = useState<
    Record<ModuleKey, EvaluationModuleState>
  >({
    standardTest: emptyModule(),
    liveQuiz: emptyModule(),
    survey: emptyModule(),
  });

  const [checklist, setChecklist] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [assessmentSuites, setAssessmentSuites] = useState<
    AssessmentSuiteOut[]
  >([]);

  useEffect(() => {
    if (!adminToken) return;
    fetchAssessmentSuites(adminToken)
      .then(setAssessmentSuites)
      .catch(() => setAssessmentSuites([]));
  }, [adminToken]);

  const categoryOptions: SelectOption[] = useMemo(() => {
    const merged = new Map<string, SelectOption>();
    DEFAULT_CATEGORY_OPTIONS.forEach((option) =>
      merged.set(option.value, option),
    );
    assessmentSuites.forEach((suite) =>
      merged.set(suite.category, {
        label: suite.category,
        value: suite.category,
      }),
    );
    return Array.from(merged.values());
  }, [assessmentSuites]);

  const questionSetOptionsFor = (category?: string): SelectOption[] => {
    const merged = new Map<string, SelectOption>();
    (DEFAULT_QUESTION_SET_OPTIONS[category ?? ""] ?? []).forEach((option) =>
      merged.set(option.value, option),
    );
    assessmentSuites
      .filter((suite) => suite.category === category)
      .forEach((suite) =>
        merged.set(suite.assessmentSuiteUid, {
          label: suite.name,
          value: suite.assessmentSuiteUid,
        }),
      );
    return Array.from(merged.values());
  };

  const selectedState = useMemo(
    () => STATES.find((item) => item.value === stateValue),
    [stateValue],
  );

  const toggleModule = (key: ModuleKey) => {
    setModules((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateModule = (
    key: ModuleKey,
    patch: Partial<EvaluationModuleState>,
  ) => {
    setModules((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const requestedBy =
    requestedByOption === "Other" ? requestedByOther : requestedByOption;

  const validateModuleSequence = (): string | null => {
    const sequence: { label: string; start: string; end: string }[] = [];
    if (attendanceEnabled) {
      sequence.push({
        label: "Attendance",
        start: checkInOpens,
        end: checkOutCloses,
      });
    }
    (["standardTest", "liveQuiz", "survey"] as ModuleKey[]).forEach((key) => {
      if (modules[key].enabled) {
        sequence.push({
          label: MODULE_LABELS[key],
          start: modules[key].startTime ?? "",
          end: modules[key].endTime ?? "",
        });
      }
    });

    for (let i = 0; i < sequence.length; i++) {
      const current = sequence[i];
      if (!current.start || !current.end) {
        return `${current.label} needs both a start and end time.`;
      }
      const start = parseTimeToMinutes(current.start);
      const end = parseTimeToMinutes(current.end);
      if (start == null || end == null) {
        return `${current.label} has an invalid time.`;
      }
      if (end <= start) {
        return `${current.label}'s end time must be after its start time.`;
      }
      if (i > 0) {
        const previous = sequence[i - 1];
        const previousEnd = parseTimeToMinutes(previous.end)!;
        if (start < previousEnd) {
          return `${current.label} can only start after ${previous.label} ends (${previous.end}).`;
        }
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (!conferenceDate || !conferenceTime) {
      setNotice("Training date and start time are required.");
      return;
    }
    if (!agreeTerms) {
      setNotice("Please agree to the Terms & Conditions to continue.");
      return;
    }
    if (!adminToken) {
      setNotice("Your session has expired. Please log in again.");
      return;
    }
    const sequenceError = validateModuleSequence();
    if (sequenceError) {
      setNotice(sequenceError);
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      await createTraining(adminToken, {
        zone: zone || undefined,
        region: region || undefined,
        company: company || undefined,
        requestedBy: requestedBy || undefined,
        trainerEmployeeId: trainerId || undefined,
        trainerName: trainerName || undefined,
        state: selectedState?.label,
        district: district || undefined,
        venue: venue || undefined,
        isResidential,
        conferenceDate,
        conferenceTime,
        trainingHub: trainingHub || undefined,
        audience: audience || undefined,
        sessionType: sessionType || undefined,
        trainingType: trainingType || undefined,
        batchSize: batchSize || undefined,
        sessionFlow: {
          attendance: attendanceEnabled
            ? {
                checkInOpens: checkInOpens || undefined,
                checkOutCloses: checkOutCloses || undefined,
                geoFencing,
              }
            : undefined,
          standardTest: modules.standardTest.enabled
            ? toPayloadModule(modules.standardTest)
            : undefined,
          liveQuiz: modules.liveQuiz.enabled
            ? toPayloadModule(modules.liveQuiz)
            : undefined,
          survey: modules.survey.enabled
            ? toPayloadModule(modules.survey)
            : undefined,
        },
        checklist,
      });

      router.back();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        adminLogout();
        router.replace({
          pathname: "/trainer_login",
          params: { reason: "session_expired" },
        });
        return;
      }
      setNotice(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    zone,
    setZone,
    region,
    setRegion,
    company,
    setCompany,
    requestedByOption,
    setRequestedByOption,
    requestedByOther,
    setRequestedByOther,
    trainerId,
    setTrainerId,
    trainerName,
    setTrainerName,
    stateValue,
    setStateValue,
    district,
    setDistrict,
    venue,
    setVenue,
    isResidential,
    setIsResidential,
    conferenceDate,
    setConferenceDate,
    conferenceTime,
    setConferenceTime,
    trainingHub,
    setTrainingHub,
    audience,
    setAudience,
    sessionType,
    setSessionType,
    trainingType,
    setTrainingType,
    batchSize,
    setBatchSize,
    attendanceEnabled,
    setAttendanceEnabled,
    checkInOpens,
    setCheckInOpens,
    checkOutCloses,
    setCheckOutCloses,
    geoFencing,
    setGeoFencing,
    modules,
    toggleModule,
    updateModule,
    checklist,
    setChecklist,
    agreeTerms,
    setAgreeTerms,
    submitting,
    notice,
    assessmentSuites,
    categoryOptions,
    questionSetOptionsFor,
    selectedState,
    handleSubmit,
  };
}
