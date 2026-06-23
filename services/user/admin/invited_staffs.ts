import { apiClient } from "../../apiclient";
import { UserInvitationResponse } from "@/types/user";

export const getInvitedStaffs = async () => {
  const response = await apiClient.get("/users/invitations", true);
  return response.data as UserInvitationResponse[];
};
