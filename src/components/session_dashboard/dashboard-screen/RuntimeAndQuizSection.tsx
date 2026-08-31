import { Fragment } from "react";

import { SessionDashboard } from "@/api/training";
import ActiveModuleCard from "@/components/session_dashboard/ActiveModuleCard";
import SessionRuntimeCard from "@/components/session_dashboard/SessionRuntimeCard";

type RuntimeAndQuizSectionProps = {
  data: SessionDashboard | null;
  actualRuntime?: string;
  onAdvanceModule: () => void;
  onEndSession: () => void;
};

export default function RuntimeAndQuizSection({
  data,
  actualRuntime,
  onAdvanceModule,
  onEndSession,
}: RuntimeAndQuizSectionProps) {
  const flow = data?.executionFlow ?? [];
  const activeIdx = flow.findIndex((m) => m.moduleKey === data?.activeModuleId);
  const active = activeIdx >= 0 ? flow[activeIdx] : null;
  const next = active && activeIdx + 1 < flow.length ? flow[activeIdx + 1] : null;

  return (
    <Fragment>
      <SessionRuntimeCard
        actualRuntime={actualRuntime}
        assignedTime="00h 42m"
        consumedTime="04h 22m"
        timeUsedPercent={92}
        moduleCompletionPercent={50}
      />

      <ActiveModuleCard
        moduleLabel={active?.label ?? null}
        startedAt={active?.startedAt ?? null}
        questionCount={data?.activeModuleQuestionCount ?? null}
        nextModuleLabel={next?.label ?? null}
        onPrimaryAction={active ? onAdvanceModule : onEndSession}
      />
    </Fragment>
  );
}
