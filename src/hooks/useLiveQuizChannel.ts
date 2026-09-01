import { useEffect, useRef } from "react";

import { getWsBaseUrl } from "@/constants/api";

// Subscribes to a conference's `/ws/live` room. The server only ever pushes a
// thin `{ "type": "live_quiz" }` nudge - `onSignal` should refetch whatever
// REST view the screen shows. Auto-reconnects on drop, same as the /ws/admin
// socket in useAuth.tsx.
const RECONNECT_DELAY_MS = 3000;

export function useLiveQuizChannel(
  conferenceUid: string | null | undefined,
  token: string | null | undefined,
  onSignal: () => void,
) {
  const onSignalRef = useRef(onSignal);
  useEffect(() => {
    onSignalRef.current = onSignal;
  });

  useEffect(() => {
    if (!conferenceUid || !token) return;

    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let stopped = false;

    const connect = () => {
      socket = new WebSocket(`${getWsBaseUrl()}/ws/live/${conferenceUid}?token=${token}`);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data?.type === "live_quiz") onSignalRef.current();
        } catch {
          // ignore malformed pushes
        }
      };
      socket.onclose = () => {
        if (!stopped) reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
      };
      socket.onerror = () => socket?.close();
    };
    connect();

    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [conferenceUid, token]);
}
