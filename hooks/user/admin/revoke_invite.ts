import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeInvite } from "@/services/user/admin/revoke_invite";
import { toast } from "sonner";

export const useRevokeInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeInvite(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: () => {
      toast.error("Failed to revoke invite");
    },
  });
};
