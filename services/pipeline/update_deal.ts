import { apiClient } from "@/services/apiclient";
import { AddDealOutputData } from "@/validation/pipeline";

// /deals/{id} (not /pipeline/deals/{id}) is the endpoint that accepts `currency`
export const updateDeal = async (
  data: Partial<AddDealOutputData> & { id: string },
) => {
  const { id, ...rest } = data;
  const response = await apiClient.patch(`/deals/${id}`, rest, true);
  return response;
};
