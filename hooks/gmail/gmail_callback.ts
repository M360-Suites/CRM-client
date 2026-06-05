import { useMutation } from "@tanstack/react-query";
import { gmailCallback } from "@/services/email/gmail_callback";
import { apiClient } from "@/services/apiclient";

interface CallbackPayload {
  code: string;
  state: string;
}

export const useGmailCallback = () => {
  return useMutation({
    mutationFn: (payload: CallbackPayload) =>
      gmailCallback(payload.code, payload.state),
    onSuccess: (data) => {
      // Optionally, you can handle any additional logic here after a successful callback
      console.log("Gmail connected successfully:", data);
    },
    onError: (error) => {
      // Handle errors if the callback fails
      console.error("Error connecting Gmail:", error);
    },
  });
};
