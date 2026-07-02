import { apiClient } from "@/services/apiclient";

export const DeleteStaff = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response;
};
