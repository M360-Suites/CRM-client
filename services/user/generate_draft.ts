import { apiClient } from "../apiclient";
import { EmailRequest } from "@/types/user";

export const generateDraft = async (data: EmailRequest) => {
  const response = await apiClient.post("/ai/email/generate", data);
  return response;
};
