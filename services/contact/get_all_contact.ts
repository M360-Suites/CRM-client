import { apiClient } from "../apiclient";
import { Contact } from "@/types/contact";

export const GetAllContacts = async (): Promise<Contact[]> => {
  const response = await apiClient.get<Contact[]>(`/contacts/all`, true);
  return response.data as Contact[];
};
