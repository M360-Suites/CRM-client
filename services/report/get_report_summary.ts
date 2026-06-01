import { apiClient } from "../apiclient";
import { ReportSummary } from "@/types/report";

export const getReportsSummary = async () => {
  const response = await apiClient.get("reports/summary");
  return response.data as ReportSummary;
};
