import { apiClient } from "@/services/apiclient";
import { AddDealOutputData } from "@/validation/pipeline";

// /deals (not /pipeline/deals) is the endpoint that accepts `currency`
export default function addDeal(data: AddDealOutputData) {
  const response = apiClient.post("/deals", data);
  return response;
}
