import { apiClient } from "@/services/apiclient";

export default function addCommentByStage(stageId: string, content: string) {
  const response = apiClient.post(
    `pipeline/stages/${stageId}/messages`,
    {
      content,
    },
    true,
  );
  return response;
}
