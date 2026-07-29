import { useQuery } from "@tanstack/react-query";
import { GetPipelineBoard } from "@/services/pipeline/get_pipeline_board";
import { PipelineBoard } from "@/types/pipeline";

export const useGetPipelineBoard = () => {
  return useQuery<PipelineBoard>({
    queryKey: ["pipeline"],
    queryFn: () => GetPipelineBoard(),
    refetchInterval: 2 * 60 * 1000,
  });
};
