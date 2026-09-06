import { clinicApi } from "@/api/clinicApi";
import type { User } from "@/interfaces/user.interface";

// Sube (o reemplaza) la foto del usuario autenticado. Si es un doctor, el
// backend replica la foto en su registro de doctor (doctors.photo_url).
export const postMyPhotoAction = async (file: File): Promise<User> => {
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await clinicApi.post<User>("/auth/me/photo", formData);
  return data;
};