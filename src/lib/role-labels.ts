import type { User } from "@/interfaces/user.interface";

// Etiqueta legible del rol para el header/dropdowns de cuenta.
export const roleLabel: Record<User["role"], string> = {
  PATIENT: "Paciente",
  DOCTOR: "Doctor/a",
  ADMIN: "Administrador/a",
};