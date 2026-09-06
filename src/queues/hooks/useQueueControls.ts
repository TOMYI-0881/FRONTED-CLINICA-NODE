import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { postQueueNextAction } from "../actions/post-next.action";
import { postQueueSkipAction } from "../actions/post-skip.action";
import { postQueueCallAction } from "../actions/post-call.action";
import { todayApiDate } from "@/lib/format-date";

export const useQueueControls = (doctorId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["queue", doctorId, todayApiDate()];

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const next = useMutation({
    mutationFn: () => postQueueNextAction(doctorId),
    onSuccess: invalidate,
  });

  const skip = useMutation({
    mutationFn: () => postQueueSkipAction(doctorId),
    onSuccess: invalidate,
  });

  const call = useMutation({
    mutationFn: () => postQueueCallAction(doctorId),
    onSuccess: invalidate,
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        toast.error("No hay nadie en curso para re-llamar");
      }
    },
  });

  return { next, skip, call };
};
