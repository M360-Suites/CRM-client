"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeadSource } from "@/services/analytics/get_lead";
import { LeadSourceData } from "@/types/analytics";

interface AnalyticsProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export const useAnalyticsLeadSource = ({ timeframe }: AnalyticsProps) => {
  return useQuery<LeadSourceData>({
    queryKey: ["analytics", "lead-source", timeframe],
    queryFn: () => getLeadSource({ timeframe }),
    refetchInterval: 10 * 60 * 1000,
  });
};
