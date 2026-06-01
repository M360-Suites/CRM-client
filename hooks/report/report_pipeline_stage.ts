"use client";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsPipeline } from "@/services/report/get_pipeline_by_stage";
import { PipelineStageData } from "@/types/report";

export const useAnalyticsPipelineStage = () => {
  return useQuery<PipelineStageData>({
    queryKey: ["report"],
    queryFn: getAnalyticsPipeline,
    refetchInterval: 10 * 60 * 1000,
  });
};
