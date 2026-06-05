import { apiClient } from "../apiclient";

export const addFiles = async (files: File[], folderId: string) => {
  const formData = new FormData();
  const key = files.length > 1 ? "documents" : "document";
  files.forEach((file) => {
    formData.append(key, file);
  });

  const response = await apiClient.post(
    `/folders/${folderId}/documents`,
    formData,
  );
  return response;
};
