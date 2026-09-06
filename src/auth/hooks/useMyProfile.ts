import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { ApiError } from "@/interfaces/api-error.interface";
import { useAuthStore } from "@/auth/store/auth.store";
import { patchMyProfileAction } from "../actions/patch-my-profile.action";

// Edición de nombre y correo del propio usuario (paciente).
export const useMyProfile = () => {
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const update = useMutation({
    mutationFn: patchMyProfileAction,
    onSuccess: (user) => {
      setUserProfile({ name: user.name ?? "", email: user.email });
      toast.success("Datos actualizados");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error.response?.data?.error ?? "No se pudieron actualizar tus datos",
      );
    },
  });

  return { update };
};