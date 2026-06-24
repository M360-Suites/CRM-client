import { apiClient } from "@/services/apiclient";

interface AssignDealRequestData {
  stage_id: string;
  user_id: string;
}

export default function assignDeal(data: AssignDealRequestData) {
    const response = apiClient.post(`/pipeline/stages/${data.stage_id}/assignees`, {
        user_id: data.user_id,
    });
    return response;
}