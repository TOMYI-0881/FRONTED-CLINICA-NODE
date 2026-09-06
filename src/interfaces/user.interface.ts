export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  name?: string;
  photoUrl?: string | null;
}
