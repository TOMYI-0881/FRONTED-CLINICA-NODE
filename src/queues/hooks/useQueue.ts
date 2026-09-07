import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueueAction } from "../actions/get-queue.action";
import { clinicSocket } from "@/lib/ws-client";
import type { QueueState } from "@/interfaces/queue.interface";

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
        // El broadcast WS no incluye myTurn (es por-paciente); se re-sincroniza del
        // estado fresco cuando el turno propio sigue en curso o en espera. Adoptar
        // el objeto del payload (y no el del cache) es clave para que notify/alertas
        // vean el status real (p.ej. "waiting" -> "in-progress") sin esperar al REST.
        queryClient.setQueryData<QueueState>(queryKey, (old) => {
          const current = message.payload.currentTurn;
          const waiting = message.payload.waiting;
          const mine = old?.myTurn ?? null;
          const myTurn = mine
            ? current?.id === mine.id
              ? current
              : waiting.find((turn) => turn.id === mine.id) ?? null
            : null;
          return { current, waiting, myTurn };
        });
      }
    });

    // Auto-reparacion: si el socket se cayo y vuelve, refetch de las colas para no
    // quedar dependiendo del proximo poll REST (el WS re-une las salas en onopen).
    const unsubscribeConnect = clinicSocket.subscribeConnect(() => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
    });

    return () => {
      unsubscribe();
      unsubscribeConnect();
      clinicSocket.leaveRoom(doctorId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, date]);

  return query;
};
