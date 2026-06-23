import { apiClient } from "@/services/apiclient";
import {AddStaffData} from "@/validation/roles";

export const EditStaff = async (
  data: Partial<AddStaffData> & { _id: string },
) => {
  const payload: Record<string, any> = {};

  if(data.fullname !== undefined) payload.display_name = data.fullname;
  if (data.email !== undefined) payload.email = data.email;
  if (data.role !== undefined) payload.role = data.role;
  

  const response = apiClient.patch(`/users/${data._id}`, payload);
  return response;
};
