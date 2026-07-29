import { useQuery } from "@tanstack/react-query";
import { GetContacts } from "@/services/contact/get_contacts";
import { ContactResponse } from "@/types/contact";

interface UseGetContactsProps {
  temperature?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const useGetContacts = (props: UseGetContactsProps) => {
  return useQuery<ContactResponse>({
    queryKey: [
      "contacts",
      props?.temperature,
      props?.page,
      props?.limit,
      props?.search,
    ],
    queryFn: () => GetContacts(props),
    refetchInterval: 5 * 60 * 1000,
  });
};
