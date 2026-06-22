import { apiClient } from "../apiclient";
import { AddStaffData } from "@/validation/roles";

export const AddStaff = async (data: AddStaffData) => {
  const response = await apiClient.post("/user/invitations", data, true);
  return response;
};
