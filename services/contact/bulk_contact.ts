import { apiClient } from "../apiclient";

export const BulkImportContacts = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/contacts/bulk-import", formData);
  return response;
};
