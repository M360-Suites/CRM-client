import { apiClient } from "../apiclient";

export const editFile = async (id: string, name: string) => {
  const response = await apiClient.patch(`/documents/${id}`, { name });
  return response;
};
