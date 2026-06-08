import { apiClient } from "../apiclient";
import { GmailAuthResponse } from "@/types/gmail";

export const AuthorizeGmail = async () => {
  const response = await apiClient.get("/email/auth", true);
  return response.data as GmailAuthResponse;
};
