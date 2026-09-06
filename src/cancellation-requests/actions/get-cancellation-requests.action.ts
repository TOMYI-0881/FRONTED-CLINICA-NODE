import { clinicApi } from "@/api/clinicApi";
import type { CancellationRequest } from "@/interfaces/cancellation-request.interface";

// Lista los pedidos pendientes de todos los doctores (bandeja de ADMIN).
export const getCancellationRequestsAction = async (): Promise<
  CancellationRequest[]
> => {
  const { data } = await clinicApi.get<CancellationRequest[]>(
    "/cancellation-requests",
  );
  return data;
};
