import { apiClient } from "../apiclient";

export const moveLeadToStage = async (dealId: string, stageId: string) => {
  const response = await apiClient.patch(
    `/pipeline/deals/${dealId}`,
    { stage_id: stageId },
    true,
  );
  return response;
};
