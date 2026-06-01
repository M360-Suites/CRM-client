import { apiClient } from "../apiclient";
import { AnalyticsSummary } from "@/types/analytics";

export const getAnalyticsSummary = async () => {
  const response = await apiClient.get("/analytics/summary");
  return response.data as AnalyticsSummary;
};
