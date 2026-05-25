import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message);
        router.push("/login");
      } else {
        toast.error(response.message || "Logout failed");
      }
    },
  });
}
