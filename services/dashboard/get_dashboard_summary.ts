import { apiClient } from "../apiclient";
import { DashboardResponse } from "@/types/dashboard";

export const GetDashboard = async () => {
  const response = await apiClient.get<DashboardResponse>(
    "/dashboard/summary",
    true,
  );
  return response.data as DashboardResponse;
};
