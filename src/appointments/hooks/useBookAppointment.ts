import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { postAppointmentAction } from "../actions/post-appointment.action";

export const useBookAppointment = (doctorId: string | undefined, date: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAppointmentAction,
    onSuccess: () => {
      toast.success("Turno reservado con éxito");
      queryClient.invalidateQueries({ queryKey: ["availability", doctorId, date] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("Ese horario ya fue tomado, elegí otro");
        queryClient.invalidateQueries({ queryKey: ["availability", doctorId, date] });
      }
    },
  });
};
