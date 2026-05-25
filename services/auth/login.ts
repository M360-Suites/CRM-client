import { apiClient } from "../apiclient";
import { LoginRequest } from "@/types/auth";
import { ApiResponse } from "@/types/common";

export const login = async (data: LoginRequest): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/login",
    data,
    false,
  );
  return response;
};
