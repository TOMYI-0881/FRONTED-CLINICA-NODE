import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAppointmentAction } from "../actions/delete-appointment.action";

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAppointmentAction,
    onSuccess: () => {
      toast.success("Turno cancelado");
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
    },
  });
};
