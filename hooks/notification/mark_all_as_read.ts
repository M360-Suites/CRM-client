import { useMutation, useQueryClient } from "@tanstack/react-query";
import MarkAllNotifications from "@/services/notification/mark_all_notification";
import { toast } from "sonner";

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MarkAllNotifications,
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
