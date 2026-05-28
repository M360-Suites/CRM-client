import { apiClient } from "../apiclient";
import { ApiResponse } from "@/types/common";
import { PipelineBoard } from "@/types/pipeline";

export const GetPipelineBoard = async () => {
  const response = await apiClient.get(`/pipeline`, true);
  console.log("pipeline response from service:", response);
  return response;
};
