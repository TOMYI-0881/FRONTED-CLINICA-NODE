import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postRequestCancellationAction } from "../actions/post-request-cancellation.action";

export const useRequestCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason: string }) =>
      postRequestCancellationAction(appointmentId, reason),
    onSuccess: () => {
      toast.success("Pedido de cancelación enviado, queda pendiente de revisión");
      queryClient.invalidateQueries({ queryKey: ["appointments", "mine"] });
    },
  });
};
