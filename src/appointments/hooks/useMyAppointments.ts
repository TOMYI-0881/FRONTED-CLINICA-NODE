import { useQuery } from "@tanstack/react-query";
import { getMyAppointmentsAction } from "../actions/get-my-appointments.action";

export const useMyAppointments = (enabled = true) => {
  return useQuery({
    queryKey: ["appointments", "mine"],
    queryFn: getMyAppointmentsAction,
    enabled,
  });
};
