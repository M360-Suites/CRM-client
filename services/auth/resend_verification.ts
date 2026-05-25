import { apiClient } from "../apiclient";
import { ApiResponse } from "@/types/common";
import { ResendVerificationRequest } from "@/types/auth";

export const resendVerification = async (
  data: ResendVerificationRequest,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/resend-verification-email",
    data,
  );
  return response;
};
