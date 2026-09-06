import { clinicApi } from "@/api/clinicApi";
import type { Turn } from "@/interfaces/queue.interface";

export const postQueueSkipAction = async (doctorId: string): Promise<Turn | null> => {
  const { data } = await clinicApi.post<Turn | null>(`/queues/${doctorId}/skip`);
  return data;
};
