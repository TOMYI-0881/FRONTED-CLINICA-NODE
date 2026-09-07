import type { AppointmentStatus } from "@/interfaces/appointment.interface";

export interface DashboardStats {
  citasPorEstado: Record<AppointmentStatus, number>;
  citasHoy: number;
  proximasCitas: number;
  totalCitas: number;
  totalPacientes: number;
  totalDoctoresActivos: number;
  totalDoctoresInactivos: number;
  cancelacionesPendientes: number;
}