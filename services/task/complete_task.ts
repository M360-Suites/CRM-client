import { apiClient } from "../apiclient";

export const CompleteTask = async (id: string) => {
  const response = await apiClient.post(`/tasks/${id}/complete`, {});
  return response;
};
