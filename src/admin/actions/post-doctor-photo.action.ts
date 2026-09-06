import { clinicApi } from "@/api/clinicApi";
import type { Doctor } from "@/interfaces/doctor.interface";

// Admin: sube (o reemplaza) la foto de un doctor. Requiere rol ADMIN.
export const postDoctorPhotoAction = async (
  id: string,
  file: File,
): Promise<Doctor> => {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await clinicApi.post<Doctor>(`/doctors/${id}/photo`, formData);
  return data;
};