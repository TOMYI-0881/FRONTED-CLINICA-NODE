import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postDoctorPhotoAction } from "../actions/post-doctor-photo.action";
import { deleteDoctorPhotoAction } from "../actions/delete-doctor-photo.action";

// Admin: sube/quita la foto de un doctor cualquiera (doctors.photo_url).
export const useDoctorPhoto = () => {
  const queryClient = useQueryClient();

  const invalidateDoctors = () =>
    queryClient.invalidateQueries({ queryKey: ["doctors"] });

  const upload = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      postDoctorPhotoAction(id, file),
    onSuccess: () => {
      toast.success("Foto actualizada");
      invalidateDoctors();
    },
  });

  const remove = useMutation({
    mutationFn: deleteDoctorPhotoAction,
    onSuccess: () => {
      toast.success("Foto eliminada");
      invalidateDoctors();
    },
  });

  return { upload, remove };
};