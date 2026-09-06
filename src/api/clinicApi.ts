import axios from "axios";
import { toast } from "sonner";
import type { ApiError } from "@/interfaces/api-error.interface";

const BASE_URL = import.meta.env.VITE_API_URL;

const clinicApi = axios.create({
  baseURL: `${BASE_URL}`,
});

// Emite "unauthorized" cuando el backend devuelve 401 fuera del login.
// auth.store se suscribe a esto para desloguear sin crear un import circular
// (clinicApi no puede importar el store: el store ya importa las actions, que importan clinicApi).
export const authEvents = new EventTarget();

clinicApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

clinicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("No se pudo conectar con el servidor");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data as ApiError | undefined;
    const message = data?.error;
    const isLoginRequest = String(error.config?.url).includes("/auth/login");

    switch (status) {
      case 400:
        if (message) toast.error(message);
        break;

      case 401:
        if (isLoginRequest) {
          toast.error("Correo o contraseña incorrectos");
        } else {
          toast.error("Tu sesión expiró, iniciá sesión de nuevo");
          authEvents.dispatchEvent(new Event("unauthorized"));
        }
        break;

      case 403:
        toast.error(message || "No tenés permiso para realizar esta acción");
        break;

      case 404:
        toast.error(message || "Recurso no encontrado");
        break;

      case 429:
        toast.error("Demasiados intentos, esperá un minuto e intentá de nuevo");
        break;

      case 500:
        toast.error("Estamos presentando problemas en estos momentos");
        break;

      // 409 (conflictos: doble reserva, doble check-in, etc.) se maneja
      // puntualmente en cada flujo, no con un toast genérico acá.
      default:
        break;
    }

    return Promise.reject(error);
  },
);

export { clinicApi };
