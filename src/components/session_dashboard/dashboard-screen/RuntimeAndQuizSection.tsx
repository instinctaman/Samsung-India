import { Fragment } from "react";

import { SessionDashboard } from "@/api/training";
import ActiveModuleCard from "@/components/session_dashboard/ActiveModuleCard";
import SessionRuntimeCard from "@/components/session_dashboard/SessionRuntimeCard";

type RuntimeAndQuizSectionProps = {
  data: SessionDashboard | null;
  actualRuntime?: string;
  onStopActiveModule: () => void;
};

export default function RuntimeAndQuizSection({
  data,
  actualRuntime,
  onStopActiveModule,
}: RuntimeAndQuizSectionProps) {
  const flow = data?.executionFlow ?? [];
  const active = flow.find((m) => m.moduleKey === data?.activeModuleId) ?? null;

  // Live progress across this session's configured modules: how many of the
  // flow's modules have finished vs. how many it contains.
  const completedModules = flow.filter((m) => m.status === "Completed").length;
  const moduleCompletionPercent = flow.length
    ? Math.round((completedModules / flow.length) * 100)
    : 0;

  return (
    <Fragment>
      <SessionRuntimeCard
        actualRuntime={actualRuntime}
        assignedTime="00h 42m"
        consumedTime="04h 22m"
        timeUsedPercent={92}
        moduleCompletionPercent={moduleCompletionPercent}
      />

      {active && (
        <ActiveModuleCard
          moduleLabel={active.label}
          startedAt={active.startedAt}
          questionCount={data?.activeModuleQuestionCount ?? null}
          onEndModule={onStopActiveModule}
        />
      )}
    </Fragment>
  );
}
