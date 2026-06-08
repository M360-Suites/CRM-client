"use client";
import { useQuery } from "@tanstack/react-query";
import { GetDashboard } from "@/services/dashboard/get_dashboard_summary";
import { DashboardResponse } from "@/types/dashboard";

export const useDashboard = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: GetDashboard,
    refetchInterval: 10 * 60 * 1000,
  });
};
