import { clinicApi } from "@/api/clinicApi";
import type { Slot } from "@/interfaces/appointment.interface";

export const getAvailabilityAction = async (
  doctorId: string,
  date: string,
): Promise<Slot[]> => {
  const { data } = await clinicApi.get<Slot[]>("/appointments/availability", {
    params: { doctorId, date },
  });
  return data;
};
