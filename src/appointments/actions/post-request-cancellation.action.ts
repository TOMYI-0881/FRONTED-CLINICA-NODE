import { clinicApi } from "@/api/clinicApi";
import type { CancellationRequest } from "@/interfaces/cancellation-request.interface";

// El DOCTOR nunca cancela directo: esto solo pide la cancelación,
// queda 'pending' hasta que un ADMIN la apruebe o rechace.
export const postRequestCancellationAction = async (
  appointmentId: string,
  reason: string,
): Promise<CancellationRequest> => {
  const { data } = await clinicApi.post<CancellationRequest>(
    `/appointments/${appointmentId}/request-cancellation`,
    { reason },
  );
  return data;
};
