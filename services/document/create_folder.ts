import { apiClient } from "../apiclient";
import { AddDocumentRequestData } from "@/validation/document";

export const createFolder = async (data: AddDocumentRequestData) => {
  const payload = {
    name: data.folderName,
    description: data.folderDescription,
  };
  const response = await apiClient.post("/folders", payload);
  return response;
};
