import { apiClient } from "@/services/apiclient";

interface InvitationProps {
  invitationToken: string;
  display_name: string;
  password: string;
}

export const acceptInvitation = async (data: InvitationProps) => {
  const response = await apiClient.post("/users/invitations/accept", {
    invitationToken: data.invitationToken,
    display_name: data.display_name,
    password: data.password
  }, true);
  return response;
}
