import { clinicApi } from "@/api/clinicApi";

// Cancelación directa e inmediata (PATIENT dueño o ADMIN). Distinta del
// pedido de cancelación de un DOCTOR (ver post-request-cancellation.action).
export const deleteAppointmentAction = async (id: string): Promise<void> => {
  await clinicApi.delete(`/appointments/${id}`);
};
