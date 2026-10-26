import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompleteTask } from "@/services/task/complete_task";
import { toast } from "sonner";

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CompleteTask(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Task marked as complete");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } else {
        toast.error(data.message || "Failed to complete task");
      }
    },
    onError: () => {
      toast.error("Failed to complete task");
    },
  });
};
