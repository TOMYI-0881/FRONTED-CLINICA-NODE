import type { User } from "@/interfaces/user.interface";

// login, register
export interface AuthResponse {
  user: User;
  token: string;
}
