import { apiClient } from "../apiclient";
import { RegisterRequest } from "@/types/auth";
import { ApiResponse } from "@/types/common";

export const register = async (data: RegisterRequest): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/auth/signup",
    {
      email: data.email,
      password: data.password,
      full_name: data.fullname,
      company_name: data.companyName,
    },
    false,
  );
  return response;
};
