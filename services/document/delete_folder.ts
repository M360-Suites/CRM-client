import { apiClient } from "../apiclient";

export const DeleteFolder = async (id: string) => {
  const response = await apiClient.delete(`/folders/${id}`);
  return response;
};
