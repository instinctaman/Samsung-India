import { useEffect, useState } from "react";

// Seconds remaining until `endsAtMs` (epoch milliseconds), re-ticking every
// second and clamped at 0. Returns 0 when `endsAtMs` is null/undefined.
// Assumes the phone and backend share a clock (same-venue use).
export function useCountdown(endsAtMs: number | null | undefined): number {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAtMs) return;
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAtMs]);

  if (!endsAtMs) return 0;
  return Math.max(0, Math.ceil((endsAtMs - nowMs) / 1000));
}
