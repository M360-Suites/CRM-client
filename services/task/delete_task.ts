import { apiClient } from "../apiclient";

export const DeleteTask = async (id: string) => {
  const response = await apiClient.delete(`/tasks/${id}`);
  return response;
};
