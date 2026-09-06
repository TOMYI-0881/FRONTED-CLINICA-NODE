import { clinicApi } from "@/api/clinicApi";
import type { User } from "@/interfaces/user.interface";

// El backend crea siempre un usuario con rol PATIENT y no devuelve token,
// solo el User -- el login se hace aparte (ver auth.store.register).
export const postRegisterAction = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  const { data } = await clinicApi.post<User>("/auth/register", {
    name,
    email,
    password,
  });

  return data;
};
