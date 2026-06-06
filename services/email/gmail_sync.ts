import { apiClient } from "../apiclient";
import { SyncResponse } from "@/types/gmail";

export const GmailSync = async () => {
  const response = await apiClient.post("/email/sync", {}, true);
  return response.data as SyncResponse;
};
