import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteDeal } from "@/services/pipeline/delete_deal";
import { toast } from "sonner";

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteDeal,
    onSuccess: async (data) => {
      if (data.status) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["pipeline"] }),
          queryClient.invalidateQueries({ queryKey: ["deals"] }),
        ]);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete assigned user");
    },
  });
};
