import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth/login";
import { toast } from "sonner";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message);
      } else {
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
}
