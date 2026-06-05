import { apiClient } from "../apiclient";
import { GmailAuthResponse } from "@/types/gmail";

export const AuthorizeGmail = async () => {
  const response = await apiClient.get("/email/auth");
  return response.data as GmailAuthResponse;
};
