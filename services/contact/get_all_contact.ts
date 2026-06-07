import { apiClient } from "../apiclient";
import { Contact, ContactResponse } from "@/types/contact";

interface UseGetContactsProps {
  temperature?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const GetContacts = async (
  props: UseGetContactsProps,
): Promise<ContactResponse> => {
  const response = await apiClient.get<ContactResponse>(`/contacts`, true, {
    temperature: props.temperature,
    page: props.page,
    limit: props.limit,
    search: props.search,
  });
  return response.data as ContactResponse;
};
