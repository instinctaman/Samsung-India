import { TrainingAgendaItem } from "@/api/training";

export type SessionTab = "all" | "today" | "completed";

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
    conferenceDate: "2026-07-07",
    conferenceTime: "09:00",
    conferenceStatus: "Ongoing",
    approvalStatus: "Approved",
    batchSize: "25",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456582",
    title: "Classroom Training",
    conferenceDate: "2026-07-07",
    conferenceTime: "12:00",
    conferenceStatus: "Scheduled",
    approvalStatus: "Approved",
    batchSize: "28",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456583",
    title: "Webinar",
    conferenceDate: "2026-07-07",
    conferenceTime: "16:00",
    conferenceStatus: "Scheduled",
    approvalStatus: "Approved",
    batchSize: "28",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456584",
    title: "Webinar",
    conferenceDate: "2026-07-06",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456585",
    title: "Webinar",
    conferenceDate: "2026-07-06",
    conferenceTime: "10:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456586",
    title: "Classroom Training",
    conferenceDate: "2026-07-05",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456587",
    title: "Classroom Training",
    conferenceDate: "2026-07-04",
    conferenceTime: "10:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456588",
    title: "Webinar",
    conferenceDate: "2026-07-04",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456589",
    title: "Classroom Training",
    conferenceDate: "2026-07-03",
    conferenceTime: "10:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "New Delhi",
    trainingType: "Classroom",
    state: "Delhi",
  },
  {
    conferenceUid: "CONF25456590",
    title: "Webinar",
    conferenceDate: "2026-07-03",
    conferenceTime: "16:00",
    conferenceStatus: "Completed",
    approvalStatus: "Approved",
    batchSize: "30",
    trainingHub: "New Delhi",
    location: "Online",
    trainingType: "Webinar",
    state: "Delhi",
  },
];
