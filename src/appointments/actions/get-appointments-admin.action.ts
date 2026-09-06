import { clinicApi } from "@/api/clinicApi";
import type { PaginatedAppointments } from "@/interfaces/appointment.interface";

export const getAppointmentsAdminAction = async (
  page: number,
  limit: number,
): Promise<PaginatedAppointments> => {
  const { data } = await clinicApi.get<PaginatedAppointments>("/appointments", {
    params: { page, limit },
  });
  return data;
};
