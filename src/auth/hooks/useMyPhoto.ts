import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/auth/store/auth.store";
import { postMyPhotoAction } from "../actions/post-my-photo.action";
import { deleteMyPhotoAction } from "../actions/delete-my-photo.action";

// Maneja la foto del usuario autenticado (self-service). Al ser doctor, el
// backend replica la foto en su registro, así que invalidamos ["doctors"].
export const useMyPhoto = () => {
  const queryClient = useQueryClient();
  const setUserPhoto = useAuthStore((state) => state.setUserPhoto);

  const invalidateDoctors = () =>
    queryClient.invalidateQueries({ queryKey: ["doctors"] });

  const upload = useMutation({
    mutationFn: postMyPhotoAction,
    onSuccess: (user) => {
      setUserPhoto(user.photoUrl ?? null);
      invalidateDoctors();
      toast.success("Foto actualizada");
    },
  });

  const remove = useMutation({
    mutationFn: deleteMyPhotoAction,
    onSuccess: () => {
      setUserPhoto(null);
      invalidateDoctors();
      toast.success("Foto eliminada");
    },
  });

  return { upload, remove };
};