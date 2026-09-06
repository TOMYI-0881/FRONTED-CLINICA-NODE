import { clinicApi } from "@/api/clinicApi";
import type { AuthResponse } from "../interfaces/auth.response";

export const postLoginAction = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const { data } = await clinicApi.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return data;
};
