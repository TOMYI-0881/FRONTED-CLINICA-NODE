import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { getAppointmentsAdminAction } from "../actions/get-appointments-admin.action";

export const useAdminAppointments = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const query = useQuery({
    queryKey: ["appointments", "admin", { page, limit }],
    queryFn: () => getAppointmentsAdminAction(page, limit),
  });

  return { ...query, page, limit };
};
