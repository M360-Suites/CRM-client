import { apiClient } from "../apiclient";
import { FolderById } from "@/types/document";

export default async function GetFolderById(folderId: string) {
  const response = await apiClient.get(`/folders/${folderId}`);
  return response.data as FolderById;
}
