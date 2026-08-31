import { useEffect, useState } from "react";

/**
 * Live session runtime in seconds, derived from the real timestamps on the
 * session dashboard response (`SessionDashboard.actualStartedAt` /
 * `actualEndedAt`, ISO strings):
 *
 *  - not started (no `startedAt`)  -> 0
 *  - ended (`endedAt` set)         -> endedAt - startedAt, frozen
 *  - running                       -> now - startedAt, re-ticking every second
 *
 * Assumes the phone and the machine running the backend share a timezone
 * (the backend sends naive local ISO timestamps) - safe for same-venue use.
 */
export function useLiveRuntime(
  startedAt: string | null | undefined,
  endedAt: string | null | undefined,
): number {
  const startMs = startedAt ? Date.parse(startedAt) : NaN;
  const endMs = endedAt ? Date.parse(endedAt) : NaN;
  const running = !Number.isNaN(startMs) && Number.isNaN(endMs);

  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  if (Number.isNaN(startMs)) return 0;
  const until = Number.isNaN(endMs) ? nowMs : endMs;
  return Math.max(0, Math.floor((until - startMs) / 1000));
}
