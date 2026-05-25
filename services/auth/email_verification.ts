import { apiClient } from "../apiclient";
import { ApiResponse } from "@/types/common";
import { EmailVerificationRequest } from "@/types/auth";

export const EmailVerification = async (
  data: EmailVerificationRequest,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/verify-email",
    data,
  );
  return response;
};
