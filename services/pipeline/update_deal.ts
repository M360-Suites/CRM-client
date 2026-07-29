import { apiClient } from "@/services/apiclient";
import { AddDealRequestData } from "@/validation/pipeline";

export const updateDeal = async (
  data: Partial<AddDealRequestData> & { id: string },
) => {
  const { id, ...rest } = data;
  const response = await apiClient.patch(`/pipeline/deals/${id}`, rest, true);
  return response;
};
