import { apiClient } from "@/services/apiclient";
import { AddStaffData } from "@/validation/roles";

export const acceptInvitation = async (data: AddStaffData) => {
  const response = await apiClient.post("/users/invitations/accept", {
    display_name: data.fullname,
    email: data.email,
    role: data.role,
  }, true);
  return response;
}
