import { clinicApi } from "@/api/clinicApi";

// Admin: quita la foto de un doctor. Requiere rol ADMIN.
export const deleteDoctorPhotoAction = async (id: string): Promise<void> => {
  await clinicApi.delete(`/doctors/${id}/photo`);
};