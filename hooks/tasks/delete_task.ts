import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteTask } from "@/services/task/delete_task";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteTask(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Task deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } else {
        toast.error(data.message || "Failed to delete task");
      }
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
};
