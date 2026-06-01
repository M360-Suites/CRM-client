"use client";
import { useQuery } from "@tanstack/react-query";
import { getLeadSource } from "@/services/report/get_lead";
import { LeadSourceData } from "@/types/report";

export const useAnalyticsLeadSource = () => {
  return useQuery<LeadSourceData>({
    queryKey: ["report", "lead-source"],
    queryFn: getLeadSource,
    refetchInterval: 10 * 60 * 1000,
  });
};
