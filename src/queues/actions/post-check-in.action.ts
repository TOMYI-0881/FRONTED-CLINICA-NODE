import { clinicApi } from "@/api/clinicApi";
import type { Turn, TurnPriority } from "@/interfaces/queue.interface";

interface CheckInInput {
  doctorId: string;
  patientName: string;
  priority?: TurnPriority;
  appointmentId?: string;
}

// Siempre opera sobre la cola de HOY (UTC) -- no hay forma de checkear
// para otro día vía API.
export const postCheckInAction = async ({
  doctorId,
  ...body
}: CheckInInput): Promise<Turn> => {
  const { data } = await clinicApi.post<Turn>(
    `/queues/${doctorId}/check-in`,
    body,
  );
  return data;
};
