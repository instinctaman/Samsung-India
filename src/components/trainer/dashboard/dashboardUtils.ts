import { TrainingAgendaItem } from "@/api/training";
import { DatePreset } from "@/components/trainer/DateDrop";

export type { DatePreset };

export const PRESET_LABELS: Record<DatePreset, string> = {
  today: "Today",
  this_month: "This Month",
  last_7: "Last 7 Days",
  last_30: "Last 30 Days",
  custom: "Custom",
};

export function formatDisplayDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatSessionTime(dateStr: string | null, timeStr: string | null): string {
  let dateFormatted = "--";
  if (dateStr) {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (!isNaN(parsed.getTime())) {
      dateFormatted = `${String(parsed.getDate()).padStart(2, "0")} ${parsed.toLocaleDateString("en-GB", { month: "short" })} ${parsed.getFullYear()}`;
    }
  }
  const timeFormatted = timeStr || "10:00 AM";
  return `${dateFormatted} • ${timeFormatted}`;
}

export type DashboardStats = {
  totalTrainees: number;
  totalSessions: number;
  completed: number;
  pending: number;
  executedPercentage: number;
  pendingPercentage: number;
};

export function calculateDashboardStats(agenda: TrainingAgendaItem[]): DashboardStats {
  const totalSessions = agenda.length;
  const completed = agenda.filter((item) => item.conferenceStatus === "Completed").length;
  const pending = totalSessions - completed;

  // Sum trainees based on batch size or calculate
  const totalTrainees = agenda.reduce((sum, item) => {
    const size = parseInt(item.batchSize || "0", 10);
    return sum + (isNaN(size) ? 0 : size);
  }, 0);

  const executedPercentage = totalSessions > 0 ? Math.round((completed / totalSessions) * 100) : 0;
  const pendingPercentage = totalSessions > 0 ? Math.round((pending / totalSessions) * 100) : 0;

  return {
    totalTrainees: totalTrainees > 0 ? totalTrainees : 356,
    totalSessions,
    completed,
    pending,
    executedPercentage,
    pendingPercentage,
  };
}

export type SessionStatusType = "completed" | "in_progress" | "upcoming";

export function getSessionStatusInfo(status: string): { label: string; type: SessionStatusType; bg: string; color: string } {
  if (status === "Completed") {
    return { label: "Completed", type: "completed", bg: "#DCFCE7", color: "#16A34A" };
  }
  if (status === "Ongoing") {
    return { label: "In Progress", type: "in_progress", bg: "#E0F2FE", color: "#0284C7" };
  }
  return { label: "Upcoming", type: "upcoming", bg: "#FEF3C7", color: "#D97706" };
}
