import { apiClient } from "@/services/apiclient";
import { AddDealRequestData } from "@/validation/pipeline";

export default function addDeal(data: AddDealRequestData) {
  const response = apiClient.post("/pipeline/deals", data);
  return response;
}
