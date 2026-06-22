import { apiClient } from "../../apiclient";
import { AddStaffData } from "@/validation/roles";

export const AddStaff = async (data: AddStaffData) => {
  const response = await apiClient.post("/users/invitations", {
    display_name: data.fullname,
    email: data.email,
    role: data.role,
  }, true);
  return response;
}
