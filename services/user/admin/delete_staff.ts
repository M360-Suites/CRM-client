import { apiClient } from "@/services/apiclient";

// Permanently deletes the staff member. Their deals, contacts, companies,
// tasks, documents and folders are reassigned to `reassignTo`, or to the
// admin making the request when omitted.
export const DeleteStaff = async (id: string, reassignTo?: string) => {
  const query = reassignTo
    ? `?reassign_to=${encodeURIComponent(reassignTo)}`
    : "";
  const response = await apiClient.delete(`/users/${id}/permanent${query}`);
  return response;
};
