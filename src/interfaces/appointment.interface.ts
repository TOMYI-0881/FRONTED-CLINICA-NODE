export type AppointmentStatus =
  | "CONFIRMED"
  | "CANCELLATION_REQUESTED"
  | "CANCELLED";

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientEmail?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface Slot {
  startTime: string;
  endTime: string;
}

export interface PaginatedAppointments {
  items: Appointment[];
  total: number;
  page: number;
  limit: number;
}
