import { apiClient } from "../apiclient";
import { LeadSourceData } from "@/types/analytics";

interface AnalyticsProps {
  timeframe?: "daily" | "weekly" | "monthly" | undefined;
}

export const getLeadSource = async ({ timeframe }: AnalyticsProps) => {
  const response = await apiClient.get("/analytics/lead-sources", true, {
    timeframe,
  });
  return response.data as LeadSourceData;
};
