import { apiClient } from "../apiclient";
import { AddContactRequestData } from "@/validation/contact";

export const AddContact = async (data: AddContactRequestData) => {
  const response = await apiClient.post("/contacts", {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    phone: data.phone,
    role_title: data.role,
    company_id: data.company,
    temperature: data.temperature,
  });
  return response;
};
