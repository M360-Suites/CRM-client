import { apiClient } from "../apiclient";
import { PipelineStageData } from "@/types/report";

export const getAnalyticsPipeline = async () => {
  const response = await apiClient.get("/reports/pipeline-by-stage");
  return response.data as PipelineStageData;
};
