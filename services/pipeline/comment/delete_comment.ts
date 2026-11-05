import { apiClient } from "@/services/apiclient";

// DELETE /pipeline/stages/{stageId}/messages/{messageId}: author or admin/sales manager
export default function deleteCommentByStage(
  stageId: string,
  messageId: string,
) {
  return apiClient.delete(
    `pipeline/stages/${stageId}/messages/${messageId}`,
    true,
  );
}
