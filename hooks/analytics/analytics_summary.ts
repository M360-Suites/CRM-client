"use client";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "@/services/analytics/get_analytics_summary";
import { AnalyticsSummary } from "@/types/analytics";

export const useAnalyticsSummary = () => {
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics"],
    queryFn: getAnalyticsSummary,
    refetchInterval: 10 * 60 * 1000,
  });
};
