import { useQuery } from "@tanstack/react-query";
import { gmailStatus } from "@/services/email/gmail_status";

export const useGmailStatus = () => {
  return useQuery({
    queryKey: ["gmailStatus"],
    queryFn: gmailStatus,
  });
};
