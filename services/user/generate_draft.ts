import { apiClient } from "../apiclient";
import { EmailRequest, EmailResponse } from "@/types/user";
import { ApiResponse } from "@/types/common";

export const generateDraft = async (data: EmailRequest) => {
  const response = await apiClient.post<EmailResponse>(
    "ai/email/generate",
    data,
  );
  return response as ApiResponse<EmailResponse>;
};
