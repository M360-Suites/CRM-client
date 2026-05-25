import { apiClient } from "../apiclient";
import { AddContactRequestData } from "@/validation/contact";

export const EditContact = async (
  data: Partial<AddContactRequestData> & { _id: string },
) => {
  const payload: Record<string, any> = {};

  if (data.firstName !== undefined) payload.first_name = data.firstName;
  if (data.lastName !== undefined) payload.last_name = data.lastName;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.role !== undefined) payload.role_title = data.role;
  if (data.company !== undefined) payload.company_id = data.company;
  if (data.temperature !== undefined) payload.temperature = data.temperature;

  const response = apiClient.patch(`/contacts/${data._id}`, payload);
  return response;
};
