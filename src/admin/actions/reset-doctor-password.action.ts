import { clinicApi } from "@/api/clinicApi";

// El backend genera la contraseña y la manda por email al doctor;
// nunca la devuelve en la respuesta.
export const resetDoctorPasswordAction = async (id: string): Promise<void> => {
  await clinicApi.post(`/doctors/${id}/reset-password`);
};
