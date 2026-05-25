import { useMutation } from "@tanstack/react-query";
import { OTPverification } from "@/services/auth/otp_verification_password";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useOTPVerification() {
  const router = useRouter();

  return useMutation({
    mutationFn: OTPverification,
    onSuccess: (response) => {
      if (response?.status && response.data) {
        toast.success(response.message);
        const url = `/reset-password?token=${encodeURIComponent(response.data.resetToken)}`;
        router.push(url);
      } else {
        toast.error(response.message || "OTP Verification failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
