import { apiClient } from "@/services/apiclient";

// Soft-deactivates the staff member: they can no longer sign in, but their
// account and records are kept and they can be reactivated later.
export const DeactivateStaff = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response;
};

export const ReactivateStaff = async (id: string) => {
  const response = await apiClient.patch(`/users/${id}`, { is_active: true });
  return response;
};
