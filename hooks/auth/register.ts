import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth/register";
import { useAuthStore } from "@/stores/auth/auth_store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const router = useRouter();
  const { setRegisterStep } = useAuthStore();

  return useMutation({
    mutationFn: register,
    onSuccess: (response, variables) => {
      if (response.status) {
        toast.success(response.message);
        setRegisterStep(2);
        const url = `/verification?email=${encodeURIComponent(variables.email)}`;
        router.push(url);
      } else {
        toast.error(response.message || "Registration failed");
      }
    },
  });
}
