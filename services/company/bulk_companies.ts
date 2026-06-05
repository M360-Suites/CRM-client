import { apiClient } from "../apiclient";

export const BulkImportCompanies = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post("/companies/bulk-import", formData);
  return response;
};
