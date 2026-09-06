import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvailabilityAction } from "../actions/get-availability.action";
import { clinicSocket } from "@/lib/ws-client";

// Carga inicial por REST y después se actualiza en incremental vía WS
// (room-updated) cuando alguien reserva/cancela un turno de este doctor.
export const useAvailability = (doctorId: string | undefined, date: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["availability", doctorId, date];

  const query = useQuery({
    queryKey,
    queryFn: () => getAvailabilityAction(doctorId!, date),
    enabled: !!doctorId && !!date,
  });

  useEffect(() => {
    if (!doctorId) return;

    clinicSocket.joinRoom(doctorId);
    const unsubscribe = clinicSocket.subscribe((message) => {
      if (
        message.type === "room-updated" &&
        message.payload.doctorId === doctorId
      ) {
        queryClient.setQueryData(queryKey, message.payload.availability);
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
