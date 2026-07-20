import { apiClient } from "../apiclient";
import { GmailAuthResponse } from "@/types/gmail";

export const AuthorizeGmail = async () => {
  const response = await apiClient.get<GmailAuthResponse>("/email/auth", true);
  return response;
};
