import { apiClient } from "../apiclient";
import { LeadSourceData } from "@/types/analytics";

export const getLeadSource = async () => {
  const response = await apiClient.get("/analytics/lead-sources");
  return response.data as LeadSourceData;
};
