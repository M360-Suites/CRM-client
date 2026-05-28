"use client";
import { useQuery } from "@tanstack/react-query";
import { GetDashboard } from "@/services/dashboard/get_dashboard_summary";
import { DashboardResponse } from "@/types/dashboard";

interface GetDashboardParams {
  temperature?: string;
}

export const useDashboard = (params?: GetDashboardParams) => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard", params],
    queryFn: () => GetDashboard(params),
    refetchInterval: 5 * 60 * 1000, // every 5 min
  });
};
