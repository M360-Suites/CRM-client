"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "@/services/analytics/get_analytics_summary";
import { AnalyticsSummary } from "@/types/analytics";

interface AnalyticsSummaryProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export const useAnalyticsSummary = ({ timeframe }: AnalyticsSummaryProps) => {
  return useQuery<AnalyticsSummary>({
    queryKey: ["analytics", timeframe],
    queryFn: () => getAnalyticsSummary({ timeframe } as AnalyticsSummaryProps),
    refetchInterval: 10 * 60 * 1000,
  });
};
