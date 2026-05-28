import { apiClient } from "../apiclient";
import { Deal } from "@/types/pipeline";

export const GetDeals = async () => {
  const response = await apiClient.get<Deal[]>(`pipeline/deals`, true);
  return response.data as Deal[];
};
