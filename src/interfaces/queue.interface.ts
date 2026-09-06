export type TurnPriority = "normal" | "preferente";
export type TurnStatus = "waiting" | "in-progress" | "done" | "skipped";

export interface Turn {
  id: string;
  doctorId: string;
  appointmentId: string | null;
  queueDate: string;
  number: number;
  patientName: string;
  photoUrl: string | null;
  priority: TurnPriority;
  status: TurnStatus;
  createdAt: string;
  finishedAt: string | null;
}

export interface QueueState {
  current: Turn | null;
  waiting: Turn[];
  myTurn: Turn | null;
}
