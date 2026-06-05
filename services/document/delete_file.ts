import { apiClient } from "../apiclient";

export const DeleteFile = async (id: string) => {
  const response = await apiClient.delete(`/documents/${id}`);
  return response;
};
