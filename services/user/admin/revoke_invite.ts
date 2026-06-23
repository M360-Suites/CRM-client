import { apiClient } from "@/services/apiclient";

export const revokeInvite = async (id: string) => {
  const response = await apiClient.delete(`/users/invitations/${id}`);
  return response;
};
