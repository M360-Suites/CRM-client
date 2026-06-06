import { apiClient } from "../apiclient";
import { MailResponse } from "@/types/gmail";

export const getMails = async () => {
  const response = await apiClient.get("/email/messages");
  return response.data as MailResponse[];
};
