import { useQuery } from "@tanstack/react-query";
import { GetContacts } from "@/services/contact/get_all_contact";
import { Contact } from "@/types/contact";

export const useGetContacts = (temperature?: string) => {
  return useQuery<Contact[]>({
    queryKey: ["contacts", temperature],
    queryFn: () => GetContacts(temperature),
    refetchInterval: 1 * 60 * 1000,
  });
};
