import { DataTableColumn } from "@/components/ui/DataTable";
import { StatusPill, StatusTone } from "@/components/ui/StatusPill";
import { TrainingAgendaItem } from "@/api/training";

export function pendingStatusColumn(): DataTableColumn<TrainingAgendaItem> {
  return {
    key: "status",
    header: "Status",
    minWidth: 92,
    render: () => <StatusPill label="Pending" tone="warning" />,
    exportValue: () => "Pending",
  };
}

const CONFERENCE_STATUS_PRESENTATION: Record<string, { label: string; tone: StatusTone }> = {
  Ongoing: { label: "Started", tone: "success" },
  Scheduled: { label: "Scheduled", tone: "warning" },
  Completed: { label: "Completed", tone: "neutral" },
};

export function conferenceStatusColumn(): DataTableColumn<TrainingAgendaItem> {
  return {
    key: "status",
    header: "Status",
    minWidth: 92,
    render: (row) => {
      const presentation = CONFERENCE_STATUS_PRESENTATION[row.conferenceStatus] ?? {
        label: row.conferenceStatus,
        tone: "neutral" as StatusTone,
      };
      return <StatusPill label={presentation.label} tone={presentation.tone} />;
    },
    exportValue: (row) => CONFERENCE_STATUS_PRESENTATION[row.conferenceStatus]?.label ?? row.conferenceStatus,
  };
}
