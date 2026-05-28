import { useQuery } from "@tanstack/react-query";
import { GetDeals } from "@/services/pipeline/get_deals";
import { Deal } from "@/types/pipeline";

export const useGetDeals = () => {
  return useQuery<Deal[]>({
    queryKey: ["deals"],
    queryFn: () => GetDeals(),
    refetchInterval: 10 * 60 * 1000,
  });
};
