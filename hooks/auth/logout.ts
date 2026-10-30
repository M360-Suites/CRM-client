import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth/logout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      if (response.status) {
        queryClient.removeQueries({ queryKey: ["user"] });
        toast.success(response.message);
        router.push("/login");
      } else {
        toast.error(response.message || "Logout failed");
      }
    },
  });
}
