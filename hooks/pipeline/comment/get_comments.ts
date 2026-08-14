import { useQuery } from "@tanstack/react-query";
import { GetCommentsByStage } from "@/services/pipeline/comment/get_comments_by_stage";
import { PipelineComment } from "@/types/pipeline";

export const useGetCommentsByStage = (stageId: string) => {
  return useQuery<PipelineComment>({
    queryKey: ["comments", stageId],
    queryFn: () => GetCommentsByStage({ stageId }),
    refetchInterval: 10 * 60 * 1000,
  });
};
