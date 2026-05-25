import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth/forgot_password";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response, variables) => {
      if (response?.status) {
        toast.success(response.message);
        const url = `/otp-verification?email=${encodeURIComponent(variables.email)}`;
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
