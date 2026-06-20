import { apiClient } from "../apiclient";

export const DisconnectGmail = async () => {
  const response = await apiClient.delete("/email/auth/disconnect", true);
  return response;
};
