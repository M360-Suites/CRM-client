"use client";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsPipeline } from "@/services/analytics/get_pipeline_by_stage";
import { PipelineStageData } from "@/types/analytics";

export const useAnalyticsPipelineStage = () => {
  return useQuery<PipelineStageData>({
    queryKey: ["analytics", "pipeline-stage"],
    queryFn: getAnalyticsPipeline,
    refetchInterval: 10 * 60 * 1000,
  });
};
