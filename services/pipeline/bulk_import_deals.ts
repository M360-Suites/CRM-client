import { apiClient } from "../apiclient";
import { BulkImportResult } from "@/types/pipeline";

export const BulkImportDeals = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<BulkImportResult>(
    "/deals/bulk-import",
    formData,
  );
  return response;
};
