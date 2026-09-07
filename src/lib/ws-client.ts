import type { Slot } from "@/interfaces/appointment.interface";
import type { Turn } from "@/interfaces/queue.interface";

export type ServerMessage =
  | { type: "room-updated"; payload: { doctorId: string; availability: Slot[] } }
  | {
      type: "queue-updated";
      payload: {
        doctorId: string;
        date: string;
        currentTurn: Turn | null;
        waiting: Turn[];
      };
    }
  | { type: "error"; payload: { message: string } };

type Listener = (message: ServerMessage) => void;
type ConnectListener = () => void;

const MAX_RECONNECT_DELAY_MS = 15000;

// VITE_WS_URL se declara con http/https (mismo host que la API); WebSocket exige
// ws/wss, así que se normaliza el esquema y se valida que la URL sea usable. Si
// falta o es inválida (p.ej. no se definió en el build de producción), el socket
// se desactiva en silencio y la app sigue funcionando por REST.
const WS_URL = (() => {
  const raw = import.meta.env.VITE_WS_URL as string | undefined;
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:") parsed.protocol = "ws:";
    if (parsed.protocol === "https:") parsed.protocol = "wss:";
    if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
})();

// El WS es solo de lectura (join/leave de salas por doctor) y de un único
// socket global reutilizado por todos los hooks que necesiten disponibilidad
// o cola en vivo. Reconecta con backoff y vuelve a unirse a las salas activas.
class ClinicSocket {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private connectListeners = new Set<ConnectListener>();
  private rooms = new Map<string, number>();
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;

  private connect() {
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    if (!WS_URL) return;

    let socket: WebSocket;
    try {
      socket = new WebSocket(WS_URL);
    } catch {
      // WS no disponible: no se conecta ni se reintenta; la app sigue por REST.
      return;
    }
    this.ws = socket;

    socket.onopen = () => {
      const wasReconnect = this.reconnectAttempts > 0;
      this.reconnectAttempts = 0;
      for (const doctorId of this.rooms.keys()) {
        this.send({ type: "join-doctor-room", payload: { doctorId } });
      }
      // Solo se notifica en re-conexiones (no en el primer open): los hooks
      // usan esto para auto-reparar su estado (p.ej. refetch de colas) cuando el
      // socket vuelve a estar disponible tras una caida.
      if (wasReconnect) {
        this.connectListeners.forEach((listener) => listener());
      }
    };

    socket.onmessage = (event) => {
      let message: ServerMessage;
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }
      this.listeners.forEach((listener) => listener(message));
    };

    socket.onclose = () => {
      if (this.ws === socket) this.scheduleReconnect();
    };

    socket.onerror = () => {
      socket.close();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer !== null || this.rooms.size === 0) return;
    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempts,
      MAX_RECONNECT_DELAY_MS,
    );
    this.reconnectAttempts++;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private send(message: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  joinRoom(doctorId: string) {
    const count = this.rooms.get(doctorId) ?? 0;
    this.rooms.set(doctorId, count + 1);
    this.connect();
    if (count === 0) {
      this.send({ type: "join-doctor-room", payload: { doctorId } });
    }
  }

  leaveRoom(doctorId: string) {
    const count = this.rooms.get(doctorId) ?? 0;
    if (count <= 1) {
      this.rooms.delete(doctorId);
      this.send({ type: "leave-doctor-room", payload: { doctorId } });
    } else {
      this.rooms.set(doctorId, count - 1);
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Notifica solo cuando el socket se vuelve a conectar tras una caida. */
  subscribeConnect(listener: ConnectListener) {
    this.connectListeners.add(listener);
    return () => this.connectListeners.delete(listener);
  }
}

export const clinicSocket = new ClinicSocket();
