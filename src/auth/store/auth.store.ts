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
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => void;
  setUserPhoto: (photoUrl: string | null) => void;
  setUserProfile: (data: { name?: string; email?: string }) => void;
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

  register: async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await postRegisterAction(name, email, password);
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

  // Tras subir/quitar la propia foto, sincroniza el user del store y lo
  // re-persiste para que el avatar del header/paneles se actualice.
  setUserPhoto: (photoUrl: string | null) => {
    const { user, token } = get();
    if (!user) return;
    const updated = { ...user, photoUrl };
    if (token) persistSession(updated, token);
    set({ user: updated });
  },

  // Tras editar nombre/correo, sincroniza el user del store y lo re-persiste.
  setUserProfile: (data: { name?: string; email?: string }) => {
    const { user, token } = get();
    if (!user) return;
    const updated = { ...user, ...data };
    if (token) persistSession(updated, token);
    set({ user: updated });
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
