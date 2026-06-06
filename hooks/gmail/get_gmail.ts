import { useQuery } from "@tanstack/react-query";
import { getMails } from "@/services/email/get_mails";

export const useGetGmail = () => {
  return useQuery({
    queryKey: ["gmailMessages"],
    queryFn: getMails,
  });
};
