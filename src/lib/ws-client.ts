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

const WS_URL = import.meta.env.VITE_WS_URL as string;
const MAX_RECONNECT_DELAY_MS = 15000;

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

    const socket = new WebSocket(WS_URL);
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
