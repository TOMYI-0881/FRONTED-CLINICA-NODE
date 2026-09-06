import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCancellationRequestsAction } from "../actions/get-cancellation-requests.action";
import { postApproveCancellationAction } from "../actions/post-approve.action";
import { postRejectCancellationAction } from "../actions/post-reject.action";

// No hay WebSocket para esta bandeja -- se refresca por polling
// (ver guía sec. 6).
export const useCancellationRequests = () => {
  const queryClient = useQueryClient();
  const queryKey = ["cancellation-requests"];

  const query = useQuery({
    queryKey,
    queryFn: getCancellationRequestsAction,
    refetchInterval: 1000 * 30,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  const approve = useMutation({
    mutationFn: postApproveCancellationAction,
    onSuccess: () => {
      toast.success("Cancelación aprobada");
      invalidate();
    },
  });

  const reject = useMutation({
    mutationFn: postRejectCancellationAction,
    onSuccess: () => {
      toast.success("Pedido rechazado, la cita vuelve a estar confirmada");
      invalidate();
    },
  });

  return { ...query, approve, reject };
};
