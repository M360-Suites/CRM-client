import { apiClient } from "@/services/apiclient";

export default function addCommentByStage(
  stageId: string,
  content: string,
  mentions: string[] = [],
) {
  const response = apiClient.post(
    `pipeline/stages/${stageId}/messages`,
    {
      content,
      // IDs of team members @mentioned in the content
      ...(mentions.length > 0 && { mentions }),
    },
    true,
  );
  return response;
}
