import { clinicApi } from "@/api/clinicApi";
import type { CancellationRequest } from "@/interfaces/cancellation-request.interface";

export const postRejectCancellationAction = async (
  id: string,
): Promise<CancellationRequest> => {
  const { data } = await clinicApi.post<CancellationRequest>(
    `/cancellation-requests/${id}/reject`,
  );
  return data;
};
