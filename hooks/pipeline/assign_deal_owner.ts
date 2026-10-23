import {
  assignDealOwner,
  AssignDealOwnerRequestData,
} from "@/services/pipeline/assign_deal_owner";
import { dealOwnersQueryKey } from "@/hooks/pipeline/get_deal_owners";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DealOwners = Record<string, string | null>;

export default function useAssignDealOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDealOwner,
    onMutate: async ({ deal_id, owner_id }: AssignDealOwnerRequestData) => {
      await queryClient.cancelQueries({ queryKey: dealOwnersQueryKey });
      const previous = queryClient.getQueryData<DealOwners>(dealOwnersQueryKey);
      queryClient.setQueryData<DealOwners>(dealOwnersQueryKey, (owners) => ({
        ...owners,
        [deal_id]: owner_id,
      }));
      return { previous };
    },
    onSuccess: async (data, variables, context) => {
      if (data.status) {
        toast.success(
          data.message ||
            (variables.owner_id ? "Deal assigned" : "Deal unassigned"),
        );
        await queryClient.invalidateQueries({ queryKey: ["deals"] });
      } else {
        queryClient.setQueryData(dealOwnersQueryKey, context?.previous);
        toast.error(data.message || "Failed to assign deal");
      }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(dealOwnersQueryKey, context?.previous);
      toast.error("Failed to assign deal");
    },
  });
}
