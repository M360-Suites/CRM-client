"use client";
import { useQuery } from "@tanstack/react-query";
import { getAIBreakdown } from "@/services/analytics/get_ai_breakdown";
import { AIBreakdownData } from "@/types/analytics";

export const useAnalyticsAIBreakdown = () => {
  return useQuery<AIBreakdownData>({
    queryKey: ["analytics", "ai-breakdown"],
    queryFn: () => getAIBreakdown(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
