import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { postAppointmentAction } from "../actions/post-appointment.action";

export const useBookAppointment = (doctorId: string | undefined, date: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAppointmentAction,
    onSuccess: () => {
      toast.success("Turno reservado con éxito. Ya estás en la fila automáticamente");
      queryClient.invalidateQueries({ queryKey: ["availability", doctorId, date] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        const message =
          (error.response.data as { error?: string } | undefined)?.error ??
          "Ese horario ya fue tomado, elegí otro";
        toast.error(message);
        queryClient.invalidateQueries({ queryKey: ["availability", doctorId, date] });
      }
    },
  });
};
