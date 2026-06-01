import { apiClient } from "../apiclient";
import { PipelineStageData } from "@/types/analytics";

export const getAnalyticsPipeline = async () => {
  const response = await apiClient.get("/analytics/pipeline-by-stage");
  return response.data as PipelineStageData;
};
