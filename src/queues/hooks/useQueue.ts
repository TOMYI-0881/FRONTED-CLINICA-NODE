import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueueAction } from "../actions/get-queue.action";
import { clinicSocket } from "@/lib/ws-client";

// Carga inicial por REST, después incremental por WS (queue-updated) --
// pensado para la pantalla que más se beneficia de tiempo real.
export const useQueue = (doctorId: string | undefined, date: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["queue", doctorId, date];

  const query = useQuery({
    queryKey,
    queryFn: () => getQueueAction(doctorId!, date),
    enabled: !!doctorId && !!date,
    refetchInterval: 1000 * 30,
  });

  useEffect(() => {
    if (!doctorId) return;

    clinicSocket.joinRoom(doctorId);
    const unsubscribe = clinicSocket.subscribe((message) => {
      if (
        message.type === "queue-updated" &&
        message.payload.doctorId === doctorId &&
        message.payload.date === date
      ) {
        queryClient.setQueryData(queryKey, {
          current: message.payload.currentTurn,
          waiting: message.payload.waiting,
        });
      }
    });

    return () => {
      unsubscribe();
      clinicSocket.leaveRoom(doctorId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, date]);

  return query;
};
