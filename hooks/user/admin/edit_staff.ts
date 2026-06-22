import { useMutation, useQueryClient } from "@tanstack/react-query";
import {EditStaff} from "@/services/user/admin/edit_staff";
import { toast } from "sonner";

export const useEditStaff = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: EditStaff,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Staff member updated successfully");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update staff member");
    },
  });
  return mutation;
};
