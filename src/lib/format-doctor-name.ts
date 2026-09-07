import type { Doctor, DoctorGender } from "@/interfaces/doctor.interface";

// El prefijo Dr./Dra. NO vive en los datos: se deriva del género al mostrar.
// Defensivo: quita un prefijo que llegara en los datos para no duplicarlo.
const TITLE: Record<DoctorGender, string> = {
  male: "Dr.",
  female: "Dra.",
};

export const formatDoctorName = (doctor: Pick<Doctor, "name" | "gender">) =>
  `${TITLE[doctor.gender]} ${doctor.name.replace(/^(Dr|Dra)\.?\s*/i, "").trim()}`;