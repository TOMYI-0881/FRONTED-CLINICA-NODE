import { clinicApi } from "@/api/clinicApi";
import type { Turn } from "@/interfaces/queue.interface";

export const postQueueCallAction = async (doctorId: string): Promise<Turn> => {
  const { data } = await clinicApi.post<Turn>(`/queues/${doctorId}/call`);
  return data;
};
