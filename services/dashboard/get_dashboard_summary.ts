import { apiClient } from "../apiclient";
import { DashboardResponse } from "@/types/dashboard";

interface GetDashboardParams {
  temperature?: string;
}

export const GetDashboard = async (
  params?: GetDashboardParams,
): Promise<DashboardResponse> => {
  const response = await apiClient.get<DashboardResponse>(
    "/dashboard/summary",
    true,
    params ? { temperature: params.temperature } : undefined,
  );
  return response.data as DashboardResponse;
};
