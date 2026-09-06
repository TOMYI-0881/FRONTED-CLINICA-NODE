import { useAuthStore } from "@/auth/store/auth.store";
import { useDoctors } from "./useDoctors";

// No hay endpoint "dame mi perfil de doctor": lo resolvemos filtrando
// GET /doctors por el userId de la cuenta logueada (Doctor.userId).
export const useMyDoctorProfile = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const query = useDoctors();
  const doctor = query.data?.find((d) => d.userId === userId);
  return { ...query, doctor };
};
