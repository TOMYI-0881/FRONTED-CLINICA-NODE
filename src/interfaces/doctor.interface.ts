export type DoctorGender = "male" | "female";

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  gender: DoctorGender;
  photoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}
