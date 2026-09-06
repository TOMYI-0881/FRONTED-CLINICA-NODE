import { clinicApi } from "@/api/clinicApi";

// Soft-delete: isActive pasa a false y cancela en cascada las citas
// futuras confirmadas de ese doctor (notifica a cada paciente por email).
export const deleteDoctorAction = async (id: string): Promise<void> => {
  await clinicApi.delete(`/doctors/${id}`);
};
