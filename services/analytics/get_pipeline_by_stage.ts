import { apiClient } from "../apiclient";
import { PipelineStageData } from "@/types/analytics";

interface AnalyticsProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export const getAnalyticsPipeline = async ({ timeframe }: AnalyticsProps) => {
  const response = await apiClient.get("/analytics/pipeline-by-stage", false, {
    timeframe,
  });
  return response.data as PipelineStageData;
};
