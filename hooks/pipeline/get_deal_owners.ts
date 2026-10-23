import { useQuery } from "@tanstack/react-query";
import { GetDealOwners } from "@/services/pipeline/get_deal_owners";
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { PipelineTeamMembers } from "@/types/pipeline";

export const dealOwnersQueryKey = ["deals", "owners"];

export const useGetDealOwners = () => {
  return useQuery<Record<string, string | null>>({
    queryKey: dealOwnersQueryKey,
    queryFn: () => GetDealOwners(),
    refetchInterval: 2 * 60 * 1000,
  });
};

export const useDealOwner = (dealId: string): PipelineTeamMembers | null => {
  const { data: owners } = useGetDealOwners();
  const { data: board } = useGetPipelineBoard();
  const ownerId = owners?.[dealId];
  if (!ownerId) return null;
  return (
    board?.team_members.find((member) => member.id === ownerId) ?? {
      id: ownerId,
      display_name: "Unknown member",
      email: "",
    }
  );
};
