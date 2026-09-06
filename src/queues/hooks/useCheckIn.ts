import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { postCheckInAction } from "../actions/post-check-in.action";
import { todayApiDate } from "@/lib/format-date";

export const useCheckIn = (doctorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCheckInAction,
    onSuccess: () => {
      toast.success("Check-in realizado");
      queryClient.invalidateQueries({
        queryKey: ["queue", doctorId, todayApiDate()],
      });
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 409) {
        toast.error("Ya hiciste check-in para esa cita");
      }
    },
  });
};
