import { apiClient } from "../apiclient";
// import { GmailAuthResponse } from "@/types/gmail";

export const gmailCallback = async (code: string, state: string) => {
  const response = await apiClient.get(
    `/email/auth/callback?code=${code}&state=${state}`,
  );
  return response;
};
