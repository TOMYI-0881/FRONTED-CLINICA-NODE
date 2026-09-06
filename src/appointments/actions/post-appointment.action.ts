import { clinicApi } from "@/api/clinicApi";
import type { Appointment } from "@/interfaces/appointment.interface";

interface BookAppointmentInput {
  doctorId: string;
  startTime: string;
  endTime: string;
}

export const postAppointmentAction = async (
  input: BookAppointmentInput,
): Promise<Appointment> => {
  const { data } = await clinicApi.post<Appointment>("/appointments", input);
  return data;
};
