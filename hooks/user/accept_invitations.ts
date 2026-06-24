import { useMutation } from "@tanstack/react-query";
import { acceptInvitation } from "@/services/user/accept_invitation";
import {useRouter} from "next/navigation";
import { toast } from "sonner";

export default function useAcceptInvitation() {
  const router = useRouter();
  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to accept invitation");
    },
  });
}
