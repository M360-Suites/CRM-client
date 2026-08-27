"use client";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsPipeline } from "@/services/analytics/get_pipeline_by_stage";
import { PipelineStageData } from "@/types/analytics";

interface AnalyticsProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export const useAnalyticsPipelineStage = ({ timeframe }: AnalyticsProps) => {
  return useQuery<PipelineStageData>({
    queryKey: ["analytics", "pipeline-stage", timeframe],
    queryFn: () => getAnalyticsPipeline({ timeframe }),
    refetchInterval: 10 * 60 * 1000,
  });
};
