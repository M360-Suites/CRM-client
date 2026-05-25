import { apiClient } from "../apiclient";
import { ApiResponse } from "@/types/common";
import { EmailVerificationRequest } from "@/types/auth";

interface OTPVerificationResponse {
  resetToken: string;
}

export const OTPverification = async (
  data: EmailVerificationRequest,
): Promise<ApiResponse<OTPVerificationResponse>> => {
  const response = await apiClient.post<OTPVerificationResponse>(
    "/auth/verify-otp",
    data,
  );
  return response;
};
