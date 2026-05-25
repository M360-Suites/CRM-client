import { apiClient } from "../apiclient";
import { ApiResponse } from "@/types/common";
import { ForgotRequest } from "@/types/auth";

export const forgotPassword = async (
  data: ForgotRequest,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/forgot-password",
    data,
  );
  return response;
};
