import { updateDeal } from "@/services/pipeline/update_deal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddDealRequestData } from "@/validation/pipeline";
import { toast } from "sonner";

export default function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AddDealRequestData> & { id: string }) =>
      updateDeal(data),
    onSuccess: async (data) => {
      if (data.status) {
        toast.success(data.message);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["pipeline"] }),
          queryClient.invalidateQueries({ queryKey: ["deals"] }),
        ]);
      } else {
        toast.error(data.message || "Failed to update deal");
      }
    },
    onError: () => {
      toast.error("Failed to add deal");
    },
  });
}
