import type { User } from "@/interfaces/user.interface";
import { create } from "zustand";
import { authEvents } from "@/api/clinicApi";
import { isTokenExpired } from "@/lib/jwt";
import { postLoginAction } from "../actions/post-login.action";
import { postRegisterAction } from "../actions/post-register.action";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthStore = {
  //properties
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;
  //getters
  isAdmin: () => boolean;
  isDoctor: () => boolean;
  isPatient: () => boolean;

  //actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
};

const persistSession = (user: User, token: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  //properties
  user: null,
  token: null,
  authStatus: "checking",

  //getters
  isAdmin: () => get().user?.role === "ADMIN",
  isDoctor: () => get().user?.role === "DOCTOR",
  isPatient: () => get().user?.role === "PATIENT",

  //actions
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const { user, token } = await postLoginAction(email, password);
      persistSession(user, token);
      set({ user, token, authStatus: "authenticated" });
      return true;
    } catch (error) {
      console.log(error);
      clearSession();
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },

  register: async (email: string, password: string): Promise<boolean> => {
    try {
      await postRegisterAction(email, password);
      // El registro no devuelve token -- logueamos inmediatamente después.
      return await get().login(email, password);
    } catch {
      clearSession();
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null, authStatus: "not-authenticated" });
  },

  // No hay endpoint de refresh/check-status en este backend (ver guía, sec. 3 y 11):
  // el token vive en localStorage y validamos su expiración client-side al arrancar
  // la app. Si expiró, se limpia sesión; si no, se restaura desde lo persistido.
  checkAuthStatus: () => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    if (!token || !rawUser || isTokenExpired(token)) {
      clearSession();
      set({ user: null, token: null, authStatus: "not-authenticated" });
      return;
    }

    try {
      const user = JSON.parse(rawUser) as User;
      set({ user, token, authStatus: "authenticated" });
    } catch {
      clearSession();
      set({ user: null, token: null, authStatus: "not-authenticated" });
    }
  },
}));

authEvents.addEventListener("unauthorized", () => {
  useAuthStore.getState().logout();
});

// Se valida una sola vez al cargar el módulo: no hay endpoint de
// refresh/check-status, así que la sesión se restaura desde el JWT
// persistido en localStorage (ver checkAuthStatus arriba).
useAuthStore.getState().checkAuthStatus();
