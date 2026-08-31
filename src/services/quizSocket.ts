import { API_BASE_URL } from "@/constants/api";

export function getWebSocketBaseUrl(): string {
  const httpUrl = API_BASE_URL;
  if (httpUrl.startsWith("https://")) {
    return httpUrl.replace("https://", "wss://");
  }
  return httpUrl.replace("http://", "ws://");
}

export type QuizSocketEvent =
  | "open"
  | "close"
  | "error"
  | "ROOM_STATE"
  | "ATTENDEE_UPDATE"
  | "QUESTION_LAUNCHED"
  | "QUESTION_ACTIVE"
  | "RESPONSE_STATS_UPDATE"
  | "TIMER_STOPPED"
  | "QUESTION_REVEAL"
  | "SHOW_LEADERBOARD"
  | "RETURN_TO_LOBBY";

export type EventHandler = (data: any) => void;

export class QuizSocketClient {
  private ws: WebSocket | null = null;
  private conferenceUid: string;
  private role: "trainer" | "trainee";
  private name: string;
  private uid?: string;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private isExplicitlyClosed = false;

  constructor(
    conferenceUid: string,
    role: "trainer" | "trainee" = "trainee",
    name: string = "User",
    uid?: string
  ) {
    this.conferenceUid = conferenceUid;
    this.role = role;
    this.name = name;
    this.uid = uid;
  }

  public connect() {
    this.isExplicitlyClosed = false;
    const wsBase = getWebSocketBaseUrl();
    const queryParams = new URLSearchParams({
      role: this.role,
      name: this.name,
      ...(this.uid ? { uid: this.uid } : {}),
    });

    const url = `${wsBase}/ws/quiz/${this.conferenceUid}?${queryParams.toString()}`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.emit("open", { status: "connected" });
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.type) {
            this.emit(payload.type, payload);
          }
        } catch {
          // ignore non-JSON messages
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.emit("close", { status: "disconnected" });
        if (!this.isExplicitlyClosed) {
          // Auto-reconnect after 3s
          setTimeout(() => {
            if (!this.isExplicitlyClosed) {
              this.connect();
            }
          }, 3000);
        }
      };

      this.ws.onerror = (err) => {
        this.emit("error", err);
      };
    } catch (e) {
      console.warn("[QuizSocket] Error creating WebSocket:", e);
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "PING" }));
      }
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public on(event: QuizSocketEvent | string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off(event: QuizSocketEvent | string, handler: EventHandler) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  private emit(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((handler) => {
        try {
          handler(data);
        } catch (err) {
          console.warn(`[QuizSocket] Handler error for event ${event}:`, err);
        }
      });
    }
  }

  public send(type: string, data: Record<string, any> = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  public startQuestion(question: any, timerSecs: number = 30) {
    this.send("START_QUESTION", { question, timerSecs });
  }

  public submitAnswer(selectedOption: string, timeTaken: number = 0) {
    this.send("SUBMIT_ANSWER", {
      answer: { selectedOption, timeTaken },
      traineeUid: this.uid,
    });
  }

  public stopTimer() {
    this.send("STOP_TIMER");
  }

  public revealAnswer(correctOption: string, explanation: string = "") {
    this.send("REVEAL_ANSWER", { correctOption, explanation });
  }

  public showLeaderboard() {
    this.send("SHOW_LEADERBOARD");
  }

  public returnToLobby() {
    this.send("LOBBY");
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }
}
