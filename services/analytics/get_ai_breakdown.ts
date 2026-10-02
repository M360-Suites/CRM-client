import { apiClient } from "../apiclient";
import { AIBreakdownData } from "@/types/analytics";

export const getAIBreakdown = async () => {
  const response = await apiClient.get("/analytics/ai-breakdown", true);
  return response.data as AIBreakdownData;
};
