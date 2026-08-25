import { TrainingAgendaItem } from "@/api/training";

export type SessionTab = "all" | "today" | "completed";

export type SessionFilters = {
  fromDate: string;
  toDate: string;
  location: string;
  sessionType: string;
};

export const DEFAULT_SESSION_FILTERS: SessionFilters = {
  fromDate: "",
  toDate: "",
  location: "",
  sessionType: "",
};

export function filterSessions(
  sessions: TrainingAgendaItem[],
  activeTab: SessionTab,
  searchQuery: string,
  filters: SessionFilters,
): TrainingAgendaItem[] {
  const todayStr = new Date().toISOString().split("T")[0];

  return sessions.filter((session) => {
    if (activeTab === "today") {
      const isToday =
        session.conferenceDate === todayStr ||
        session.conferenceStatus === "Ongoing" ||
        session.conferenceTime === "09:00" ||
        session.conferenceTime === "12:00";
      if (!isToday) return false;
    } else if (activeTab === "completed") {
      if (session.conferenceStatus !== "Completed") return false;
    }

    if (filters.fromDate && session.conferenceDate && session.conferenceDate < filters.fromDate) {
      return false;
    }
    if (filters.toDate && session.conferenceDate && session.conferenceDate > filters.toDate) {
      return false;
    }

    if (filters.location && (session.trainingHub || session.state) !== filters.location) {
      return false;
    }

    if (filters.sessionType && session.trainingType !== filters.sessionType) {
      return false;
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = (session.title || "").toLowerCase().includes(q);
      const matchesUid = (session.conferenceUid || "").toLowerCase().includes(q);
      const matchesLocation = (session.trainingHub || session.state || "").toLowerCase().includes(q);
      return matchesTitle || matchesUid || matchesLocation;
    }

    return true;
  });
}

export function getUniqueOptions(
  sessions: TrainingAgendaItem[],
  field: "trainingHub" | "trainingType"
): { label: string; value: string }[] {
  const seen = new Set<string>();
  const options: { label: string; value: string }[] = [];
  for (const session of sessions) {
    const raw = session[field];
    if (!raw || raw === "Not Assigned" || seen.has(raw)) continue;
    seen.add(raw);
    options.push({ label: raw, value: raw });
  }
  return options;
}

export type SessionDisplayStatus = "live_now" | "scheduled" | "completed";

export type SessionStatusConfig = {
  label: string;
  dotColor?: string;
  badgeBg: string;
  badgeTextColor: string;
  borderColor: string;
  buttonType: "launch" | "report";
  buttonBg: string;
  buttonText: string;
};

export function getSessionStatusConfig(
  conferenceStatus: string,
  approvalStatus?: string
): SessionStatusConfig {
  const normalized = (conferenceStatus || "").toLowerCase();

  if (normalized === "ongoing" || normalized === "live" || normalized === "live now") {
    return {
      label: "LIVE NOW",
      dotColor: "#EF4444",
      badgeBg: "#FEE2E2",
      badgeTextColor: "#EF4444",
      borderColor: "#FCA5A5",
      buttonType: "launch",
      buttonBg: "#0066FF",
      buttonText: "LAUNCH",
    };
  }

  if (normalized === "completed") {
    return {
      label: "COMPLETED",
      dotColor: "#0D9488",
      badgeBg: "#CCFBF1",
      badgeTextColor: "#0D9488",
      borderColor: "#99F6E4",
      buttonType: "report",
      buttonBg: "#1E293B",
      buttonText: "REPORT",
    };
  }

  // Scheduled / Upcoming default
  return {
    label: "SCHEDULED",
    badgeBg: "#FEF3C7",
    badgeTextColor: "#B45309",
    borderColor: "#FDE68A",
    buttonType: "launch",
    buttonBg: "#0066FF",
    buttonText: "LAUNCH",
  };
}

export function parseSessionDate(dateStr?: string | null, timeStr?: string | null) {
  let day = "07";
  let month = "JUL";
  let time = timeStr || "09:00";

  if (dateStr) {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (!isNaN(parsed.getTime())) {
      day = String(parsed.getDate()).padStart(2, "0");
      month = parsed.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
    }
  }

  return { day, month, time };
}

export const MOCK_SESSIONS: TrainingAgendaItem[] = [
  {
    conferenceUid: "CONF25456581",
    title: "Classroom Training",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-07",
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    batchSize: "25",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456582",
    title: "Classroom Training",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-07",
    conferenceTime: "12:00",
    conferenceStatus: "Scheduled",
    approvalStatus: "Approved",
    batchSize: "28",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456583",
    title: "Webinar",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-07",
    conferenceTime: "16:00",
    conferenceStatus: "Scheduled",
    approvalStatus: "Approved",
    batchSize: "28",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456584",
    title: "Webinar",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-06",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456585",
    title: "Webinar",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-06",
    conferenceTime: "10:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456586",
    title: "Classroom Training",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-05",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456587",
    title: "Classroom Training",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-04",
    conferenceTime: "10:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456588",
    title: "Webinar",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-04",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456589",
    title: "Classroom Training",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-03",
    conferenceTime: "10:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
  {
    conferenceUid: "CONF25456590",
    title: "Webinar",
    trainerName: "Demo Trainer",
    conferenceDate: "2026-07-03",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
    totalPax: null,
    hoid: null,
    venueName: null,
    district: null,
    updatedBy: null,
    updationOn: null,
    timestamp: null,
  },
];
