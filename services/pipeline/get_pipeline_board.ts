import { apiClient } from "../apiclient";
import { PipelineBoard } from "@/types/pipeline";

export const GetPipelineBoard = async () => {
  const response = await apiClient.get(`/pipeline`, true);
  console.log("Pipeline board response:", response.data);
  return response.data as PipelineBoard;
};
