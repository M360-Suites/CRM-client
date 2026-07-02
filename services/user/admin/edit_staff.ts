import { apiClient } from "@/services/apiclient";
import { AddStaffData } from "@/validation/roles";

interface EditStaffPayload {
  display_name?: string;
  email?: string;
  role?: string;
}

export const EditStaff = async (
  data: Partial<AddStaffData> & { _id: string },
) => {
  const payload: EditStaffPayload = {};

  if (data.fullname !== undefined) payload.display_name = data.fullname;
  if (data.email !== undefined) payload.email = data.email;
  if (data.role !== undefined) payload.role = data.role;

  const response = await apiClient.patch(`/users/${data._id}`, payload);
  return response;
};
