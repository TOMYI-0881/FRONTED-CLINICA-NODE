import { clinicApi } from "@/api/clinicApi";
import type { Doctor } from "@/interfaces/doctor.interface";

interface UpdateDoctorInput {
  id: string;
  name?: string;
  specialty?: string;
}

// Solo edita el perfil (nombre/especialidad), no la cuenta/email.
export const patchDoctorAction = async ({
  id,
  ...body
}: UpdateDoctorInput): Promise<Doctor> => {
  const { data } = await clinicApi.patch<Doctor>(`/doctors/${id}`, body);
  return data;
};
