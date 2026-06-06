import { apiClient } from "../apiclient";
import { GmailStatusResponse } from "@/types/gmail";

export const gmailStatus = async () => {
  const response = await apiClient.get(`/email/status`);
  return response.data as GmailStatusResponse;
};
