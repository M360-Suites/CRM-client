import { useQueryClient, useMutation } from "@tanstack/react-query";
import { SendGmail } from "@/services/email/send_mail";
import { SendMailRequest } from "@/types/gmail";
import { toast } from "sonner";

export default function useSendGmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMailRequest) => SendGmail(data),
    onSuccess: (data) => {
      toast.success(data.message || "Email sent successfully");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: () => {
      toast.error("Failed to send email");
    },
  });
}
