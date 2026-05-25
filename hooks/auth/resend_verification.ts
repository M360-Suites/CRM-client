import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "@/services/auth/resend_verification";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useResendVerification() {
  const router = useRouter();

  return useMutation({
    mutationFn: resendVerification,
    onSuccess: (response, variables) => {
      if (response?.status) {
        toast.success(response.message);
        const url = `/verification?email=${encodeURIComponent(variables.email)}`;
        router.push(url);
      } else {
        toast.error(response.message || "Forgot Password failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
