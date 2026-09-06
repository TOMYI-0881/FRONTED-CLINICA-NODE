export interface Doctor {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  photoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}
