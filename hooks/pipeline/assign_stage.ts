import assignDeal from "@/services/pipeline/assign_deal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useAssignDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDeal,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Deal assigned successfully");
        queryClient.invalidateQueries({ queryKey: ["pipeline"] });
      } else {
        toast.error(data.message || "Failed to assign deal");
      }
    },
    onError: () => {
      toast.error("Failed to assign deal");
    },
  });
}
