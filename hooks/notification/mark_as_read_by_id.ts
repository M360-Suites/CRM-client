import { useMutation, useQueryClient } from "@tanstack/react-query";
import MarkAsReadById from "@/services/notification/mark_notification_by_id";
import { toast } from "sonner";

export const useMarkAsReadById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MarkAsReadById,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update notification");
    },
  });
};
