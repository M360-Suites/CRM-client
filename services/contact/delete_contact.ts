import { apiClient } from "../apiclient";

export const DeleteContact = async (id: string) => {
  const response = await apiClient.delete(`/contacts/${id}`);
  return response;
};
