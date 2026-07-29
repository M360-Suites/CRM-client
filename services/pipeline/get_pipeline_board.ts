import { apiClient } from "../apiclient";
import { PipelineBoard } from "@/types/pipeline";

export const GetPipelineBoard = async () => {
  const response = await apiClient.get(`/pipeline`, true);
  return response.data as PipelineBoard;
};
