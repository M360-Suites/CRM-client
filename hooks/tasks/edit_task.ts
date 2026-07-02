import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditTask } from "@/services/task/edit_task";
import { AddTaskRequestData } from "@/validation/task";
import { toast } from "sonner";

export const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AddTaskRequestData> & { _id: string }) =>
      EditTask(data),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Task updated successfully");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      } else {
        toast.error(data.message || "Failed to update task");
      }
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
};
