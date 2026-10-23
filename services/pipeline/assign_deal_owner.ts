import { apiClient } from "@/services/apiclient";

export interface AssignDealOwnerRequestData {
  deal_id: string;
  owner_id: string | null;
}

export const assignDealOwner = async (data: AssignDealOwnerRequestData) => {
  const response = await apiClient.patch(
    `/deals/${data.deal_id}/assign`,
    { owner_id: data.owner_id },
    true,
  );
  return response;
};
