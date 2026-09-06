import { clinicApi } from "@/api/clinicApi";
import type { Doctor } from "@/interfaces/doctor.interface";

// Lista doctores activos, sin paginar (público).
export const getDoctorsAction = async (): Promise<Doctor[]> => {
  const { data } = await clinicApi.get<Doctor[]>("/doctors");
  return data;
};
