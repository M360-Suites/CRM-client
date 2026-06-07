import { useQuery } from "@tanstack/react-query";
import { getMails } from "@/services/email/get_mails";

interface UseGetGmailProps {
  page?: number;
  limit?: number;
}

export const useGetGmail = ({
  page = 1,
  limit = 25,
}: UseGetGmailProps = {}) => {
  return useQuery({
    queryKey: ["gmailMessages", page, limit],
    queryFn: () => getMails({ page, limit }),
  });
};
