import { apiClient } from "../apiclient";
import { AnalyticsSummary } from "@/types/analytics";

interface AnalyticsSummaryProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export const getAnalyticsSummary = async (props: AnalyticsSummaryProps) => {
  const response = await apiClient.get(
    `/analytics/summary?timeframe=${props.timeframe}`,
    true,
  );
  return response.data as AnalyticsSummary;
};
