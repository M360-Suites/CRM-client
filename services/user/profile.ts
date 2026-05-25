import { apiClient } from "../apiclient";
import { User } from "@/types/user";

export const getUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data as User;
};
