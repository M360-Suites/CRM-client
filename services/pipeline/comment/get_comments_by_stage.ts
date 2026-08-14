import { apiClient } from "@/services/apiclient";
import { PipelineComment } from "@/types/pipeline";

interface GetCommentsByStageProps {
  stageId: string;
}

export const GetCommentsByStage = async ({
  stageId,
}: GetCommentsByStageProps) => {
  const response = await apiClient.get<PipelineComment>(
    `pipeline/stages/${stageId}/messages`,
    true,
  );
  return response.data as PipelineComment;
};
