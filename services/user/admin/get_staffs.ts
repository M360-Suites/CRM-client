import { apiClient } from "../../apiclient";
import { StaffResponse } from "@/types/user";

export const GetStaffs = async () => {
  const response = await apiClient.get("/users", true);
  return response.data as StaffResponse;
};
