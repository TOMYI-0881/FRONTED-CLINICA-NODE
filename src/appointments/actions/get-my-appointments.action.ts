import { clinicApi } from "@/api/clinicApi";
import type { Appointment } from "@/interfaces/appointment.interface";

// Sirve tanto para PATIENT (sus citas como paciente) como para DOCTOR
// (sus citas como doctor, usado para elegir cuál pedir cancelar).
export const getMyAppointmentsAction = async (): Promise<Appointment[]> => {
  const { data } = await clinicApi.get<Appointment[]>("/appointments/mine");
  return data;
};
