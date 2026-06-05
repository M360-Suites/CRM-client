import { useMutation } from "@tanstack/react-query";
import { gmailStatus } from "@/services/email/gmail_status";

export const useGmailStatus = () => {
  return useMutation({
    mutationFn: gmailStatus,
    onSuccess: (data) => {
      console.log("Gmail connected successfully:", data);
    },
    onError: (error) => {
      console.error("Error connecting Gmail:", error);
    },
  });
};
