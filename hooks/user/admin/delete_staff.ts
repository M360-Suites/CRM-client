import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteStaff } from "@/services/user/admin/delete_staff";
import { toast } from "sonner";

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteStaff(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Staff member deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete staff member");
    },
  });
};
