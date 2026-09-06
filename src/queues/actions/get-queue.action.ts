import { clinicApi } from "@/api/clinicApi";
import type { QueueState } from "@/interfaces/queue.interface";

export const getQueueAction = async (
  doctorId: string,
  date: string,
): Promise<QueueState> => {
  const { data } = await clinicApi.get<QueueState>(`/queues/${doctorId}`, {
    params: { date },
  });
  return data;
};
