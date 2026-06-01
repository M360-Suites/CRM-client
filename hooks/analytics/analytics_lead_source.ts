"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeadSource } from "@/services/analytics/get_lead";
import { LeadSourceData } from "@/types/analytics";

export const useAnalyticsLeadSource = () => {
  return useQuery<LeadSourceData>({
    queryKey: ["analytics", "lead-source"],
    queryFn: getLeadSource,
    refetchInterval: 10 * 60 * 1000,
  });
};
