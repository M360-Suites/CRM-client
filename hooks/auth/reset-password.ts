import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth/reset_password";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message);
        const url = `/login`;
        router.push(url);
      } else {
        toast.error(response.message || "Reset password failed");
      }
    },
  });
}
