import { apiClient } from "../apiclient";

export interface EditFolderPayload {
  name: string;
  description: string;
}

export const editFolder = async (id: string, data: EditFolderPayload) => {
  const response = await apiClient.patch(`/folders/${id}`, data);
  return response;
};
