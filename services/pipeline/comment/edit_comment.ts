import { apiClient } from "@/services/apiclient";

// PATCH /pipeline/stages/{stageId}/messages/{messageId}: author or admin/sales manager.
// Only newly added mentions are notified, so sending the full list is safe.
export default function editCommentByStage(
  stageId: string,
  messageId: string,
  content: string,
  mentions: string[] = [],
) {
  return apiClient.patch(
    `pipeline/stages/${stageId}/messages/${messageId}`,
    { content, mentions },
    true,
  );
}
