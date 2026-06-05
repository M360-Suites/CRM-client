import { apiClient } from "../apiclient";
// import { GmailAuthResponse } from "@/types/gmail";

export const gmailStatus = async () => {
  const response = await apiClient.get(`/email/status`);
  return response;
};
