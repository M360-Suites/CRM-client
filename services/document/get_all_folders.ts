import { apiClient } from "../apiclient";
import { Folder } from "@/types/document";

export default async function GetFolders() {
  const response = await apiClient.get("/folders");
  return response.data as Folder[];
}
