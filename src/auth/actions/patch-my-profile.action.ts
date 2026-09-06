import { clinicApi } from "@/api/clinicApi";
import type { User } from "@/interfaces/user.interface";

// Edita nombre y correo del usuario autenticado. El backend devuelve el user
// actualizado; el JWT no contiene el email, así que la sesión sigue válida.
export const patchMyProfileAction = async (data: {
  name: string;
  email: string;
}): Promise<User> => {
  const { data: updated } = await clinicApi.patch<User>("/auth/me", data);
  return updated;
};