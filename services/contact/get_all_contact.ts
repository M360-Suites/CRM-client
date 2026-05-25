import { apiClient } from "../apiclient";
import { Contact } from "@/types/contact";

interface GetContactsParams {
  temperature?: string;
}

export const GetContacts = async (temperature?: string): Promise<Contact[]> => {
  const response = await apiClient.get<Contact[]>(
    "/contacts",
    true,
    temperature ? { temperature } : undefined,
  );
  return response.data as Contact[];
};
