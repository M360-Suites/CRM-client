import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveLeadToStage } from "@/services/pipeline/move_deals";
import { PipelineBoard } from "@/types/pipeline";
import { toast } from "sonner";

type MoveLeadArgs = { dealId: string; stageId: string };

export default function useMoveLeadToStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, stageId }: MoveLeadArgs) =>
      moveLeadToStage(dealId, stageId),

    onMutate: async ({ dealId, stageId }: MoveLeadArgs) => {
      await queryClient.cancelQueries({ queryKey: ["pipeline"] });

      const previous = queryClient.getQueryData<PipelineBoard>(["pipeline"]);

      queryClient.setQueryData<PipelineBoard>(["pipeline"], (old) => {
        if (!old) return old;

        let movedDeal: PipelineBoard["stages"][0]["deals"][0] | undefined;

        const stages = old.stages.map((stage) => {
          const dealIndex = stage.deals.findIndex((d) => d.id === dealId);
          if (dealIndex === -1) return stage;

          movedDeal = stage.deals[dealIndex];
          return {
            ...stage,
            deals: stage.deals.filter((d) => d.id !== dealId),
            total_deals: stage.total_deals - 1,
          };
        });

        if (!movedDeal) return old;

        return {
          ...old,
          stages: stages.map((stage) => {
            if (stage.id !== stageId) return stage;
            return {
              ...stage,
              deals: [{ ...movedDeal!, stage_id: stageId }, ...stage.deals],
              total_deals: stage.total_deals + 1,
            };
          }),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["pipeline"], context.previous);
      }
      toast.error("Failed to move deal");
    },

    onSuccess: (data) => {
      if (data?.status) {
        // toast.success(data.message || "Deal moved successfully");
      } else {
        toast.error(data?.message || "Failed to move deal");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
}
