import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postDoctorAction } from "../actions/post-doctor.action";
import { patchDoctorAction } from "../actions/patch-doctor.action";
import { deleteDoctorAction } from "../actions/delete-doctor.action";
import { resetDoctorPasswordAction } from "../actions/reset-doctor-password.action";

export const useDoctorsAdmin = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["doctors"] });

  const create = useMutation({
    mutationFn: postDoctorAction,
    onSuccess: () => {
      toast.success("Doctor creado");
      invalidate();
    },
  });

  const update = useMutation({
    mutationFn: patchDoctorAction,
    onSuccess: () => {
      toast.success("Doctor actualizado");
      invalidate();
    },
  });

  const deactivate = useMutation({
    mutationFn: deleteDoctorAction,
    onSuccess: () => {
      toast.success("Doctor desactivado");
      invalidate();
    },
  });

  const resetPassword = useMutation({
    mutationFn: resetDoctorPasswordAction,
    onSuccess: () => {
      toast.success("Se envió la nueva contraseña por correo al doctor");
    },
  });

  return { create, update, deactivate, resetPassword };
};
