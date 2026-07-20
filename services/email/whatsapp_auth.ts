import { apiClient } from "../apiclient";
import { GmailAuthResponse } from "@/types/gmail";

export const AuthorizeWhatsapp = async () => {
  const response = await apiClient.post<GmailAuthResponse>(
    "/social-accounts/connect/whatsapp",
    true,
  );
  return response;
};
