import { useQuery } from "@tanstack/react-query";
import { GetAllContacts } from "@/services/contact/get_all_contact";
import { Contact } from "@/types/contact";

export const useGetAllContacts = () => {
  return useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: () => GetAllContacts(),
    refetchInterval: 5 * 60 * 1000,
  });
};
