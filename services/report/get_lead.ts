import { apiClient } from "../apiclient";
import { LeadSourceData } from "@/types/report";

export const getLeadSource = async () => {
  const response = await apiClient.get("/reports/deal-source-mix");
  return response.data as LeadSourceData;
};
