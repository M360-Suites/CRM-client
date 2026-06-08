import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddTask } from "@/services/task/add_task";
import { toast } from "sonner";

export const useAddTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AddTask,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Task added successfully");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } else {
        toast.error(data.message || "Failed to add task");
      }
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });
  return mutation;
};
