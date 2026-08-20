import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { SelectOption } from "@/components/ui/SearchableSelect";
import { STATES } from "@/data/states";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, AssessmentSuiteOut, ModuleConfig, createTraining, fetchAssessmentSuites } from "@/api/training";
import { DEFAULT_CATEGORY_OPTIONS, DEFAULT_QUESTION_SET_OPTIONS, ModuleKey } from "./constants";
import { parseTimeToMinutes, toPayloadModule } from "./formatting";

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

  const [modules, setModules] = useState<Record<ModuleKey, EvaluationModuleState>>({
    standardTest: emptyModule(),
    liveQuiz: emptyModule(),
    survey: emptyModule(),
  });

  const [checklist, setChecklist] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [assessmentSuites, setAssessmentSuites] = useState<AssessmentSuiteOut[]>([]);

  useEffect(() => {
    if (!adminToken) return;
    fetchAssessmentSuites(adminToken)
      .then(setAssessmentSuites)
      .catch(() => setAssessmentSuites([]));
  }, [adminToken]);

  const categoryOptions: SelectOption[] = useMemo(() => {
    const merged = new Map<string, SelectOption>();
    DEFAULT_CATEGORY_OPTIONS.forEach((option) => merged.set(option.value, option));
    assessmentSuites.forEach((suite) => merged.set(suite.category, { label: suite.category, value: suite.category }));
    return Array.from(merged.values());
  }, [assessmentSuites]);

  const questionSetOptionsFor = (category?: string): SelectOption[] => {
    const merged = new Map<string, SelectOption>();
    (DEFAULT_QUESTION_SET_OPTIONS[category ?? ""] ?? []).forEach((option) => merged.set(option.value, option));
    assessmentSuites
      .filter((suite) => suite.category === category)
      .forEach((suite) => merged.set(suite.assessmentSuiteUid, { label: suite.name, value: suite.assessmentSuiteUid }));
    return Array.from(merged.values());
  };

  const selectedState = useMemo(() => STATES.find((item) => item.value === stateValue), [stateValue]);

  const toggleModule = (key: ModuleKey) => {
    setModules((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
  };

  const updateModule = (key: ModuleKey, patch: Partial<EvaluationModuleState>) => {
    setModules((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const requestedBy = requestedByOption === "Other" ? requestedByOther : requestedByOption;

  // Modules always run in this fixed order (matches the backend's
  // MODULE_SEQUENCE) - each enabled module's window must fully close
  // before the next one's is allowed to open, so a trainee always has a
  // real chance to complete the current one before it's skipped past.
  const validateModuleSequence = (): string | null => {
    const sequence: { label: string; start: string; end: string }[] = [];
    if (attendanceEnabled) {
      sequence.push({ label: "Attendance", start: checkInOpens, end: checkOutCloses });
    }
    (["standardTest", "liveQuiz", "survey"] as ModuleKey[]).forEach((key) => {
      if (modules[key].enabled) {
        sequence.push({
          label: key === "standardTest" ? "Standard Test" : key === "liveQuiz" ? "Live Quiz (FFF)" : "Survey",
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
            ? { checkInOpens: checkInOpens || undefined, checkOutCloses: checkOutCloses || undefined, geoFencing }
            : undefined,
          standardTest: modules.standardTest.enabled ? toPayloadModule(modules.standardTest) : undefined,
          liveQuiz: modules.liveQuiz.enabled ? toPayloadModule(modules.liveQuiz) : undefined,
          survey: modules.survey.enabled ? toPayloadModule(modules.survey) : undefined,
        },
        checklist,
      });

      router.back();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        adminLogout();
        router.replace({ pathname: "/trainer_login", params: { reason: "session_expired" } });
        return;
      }
      setNotice(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    zone, setZone,
    region, setRegion,
    company, setCompany,
    requestedByOption, setRequestedByOption,
    requestedByOther, setRequestedByOther,
    requestedBy,

    trainerId, setTrainerId,
    trainerName, setTrainerName,
    stateValue, setStateValue,
    district, setDistrict,
    venue, setVenue,
    selectedState,

    isResidential, setIsResidential,
    conferenceDate, setConferenceDate,
    conferenceTime, setConferenceTime,
    trainingHub, setTrainingHub,
    audience, setAudience,
    sessionType, setSessionType,
    trainingType, setTrainingType,
    batchSize, setBatchSize,

    attendanceEnabled, setAttendanceEnabled,
    checkInOpens, setCheckInOpens,
    checkOutCloses, setCheckOutCloses,
    geoFencing, setGeoFencing,

    modules, toggleModule, updateModule,
    categoryOptions, questionSetOptionsFor, assessmentSuites,

    checklist, setChecklist,
    agreeTerms, setAgreeTerms,

    submitting, notice, handleSubmit,
  };
}

export type AddTrainingForm = ReturnType<typeof useAddTrainingForm>;
