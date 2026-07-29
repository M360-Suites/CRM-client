import { apiClient } from "../apiclient";

export const DeleteDeal = async (dealId: string) => {
  const response = await apiClient.delete(`/pipeline/deals/${dealId}`);
  return response;
};
