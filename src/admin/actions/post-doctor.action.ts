import { clinicApi } from "@/api/clinicApi";
import type { Doctor, DoctorGender } from "@/interfaces/doctor.interface";

interface CreateDoctorInput {
  name: string;
  specialty: string;
  gender: DoctorGender;
  email: string;
  password: string;
}

// Crea la cuenta DOCTOR y el perfil juntos.
export const postDoctorAction = async (
  input: CreateDoctorInput,
): Promise<Doctor> => {
  const { data } = await clinicApi.post<Doctor>("/doctors", input);
  return data;
};
