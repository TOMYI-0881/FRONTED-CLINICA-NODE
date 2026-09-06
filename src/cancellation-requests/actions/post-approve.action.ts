import { clinicApi } from "@/api/clinicApi";
import type { CancellationRequest } from "@/interfaces/cancellation-request.interface";

export const postApproveCancellationAction = async (
  id: string,
): Promise<CancellationRequest> => {
  const { data } = await clinicApi.post<CancellationRequest>(
    `/cancellation-requests/${id}/approve`,
  );
  return data;
};
