import { clinicApi } from "@/api/clinicApi";

// Quita la foto del usuario autenticado (también limpia doctors.photo_url
// si la cuenta es de un doctor).
export const deleteMyPhotoAction = async (): Promise<void> => {
  await clinicApi.delete("/auth/me/photo");
};