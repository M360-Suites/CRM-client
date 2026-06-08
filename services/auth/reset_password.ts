import { apiClient } from "../apiclient";
import { ResetRequest } from "@/types/auth";
import { ApiResponse } from "@/types/common";

export const resetPassword = async (
  data: ResetRequest,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/reset-password",
    {
      newPassword: data.newPassword,
      resetToken: data.token,
    },
    false,
  );
  return response;
};
