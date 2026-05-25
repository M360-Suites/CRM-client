import { apiClient } from "../apiclient";
import { ApiResponse } from "@/types/common";

export const logout = async (): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>("/auth/logout", {}, false);
  return response;
};
