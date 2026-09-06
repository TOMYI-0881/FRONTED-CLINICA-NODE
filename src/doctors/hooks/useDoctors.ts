import { useQuery } from "@tanstack/react-query";
import { getDoctorsAction } from "../actions/get-doctors.action";

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctorsAction,
    staleTime: 1000 * 60,
  });
};
