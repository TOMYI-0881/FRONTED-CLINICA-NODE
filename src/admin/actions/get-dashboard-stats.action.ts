import { clinicApi } from "@/api/clinicApi";
import type { DashboardStats } from "@/admin/interfaces/dashboard-stats.interface";

export const getDashboardStatsAction = async (): Promise<DashboardStats> => {
  const { data } = await clinicApi.get<DashboardStats>("/admin/dashboard/stats");
  return data;
};