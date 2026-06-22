import { useQueryClient, useMutation} from "@tanstack/react-query";
import { AddStaff } from "@/services/user/admin/add_staff";
import { toast } from "sonner";

export const useAddStaff = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addStaff"],
    mutationFn: AddStaff,
    onSuccess: (data) => {      
        toast.success(data.message || "Staff added successfully");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add staff");
    },
  });
};