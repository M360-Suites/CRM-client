import { useMutation } from "@tanstack/react-query";
import { EmailVerification } from "@/services/auth/email_verification";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useEmailVerification() {
  const router = useRouter();

  return useMutation({
    mutationFn: EmailVerification,
    onSuccess: (response) => {
      if (response?.status) {
        toast.success(response.message);
        const url = `/login`;
        router.push(url);
      } else {
        toast.error(response.message || "Email Verification failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
