import { useQuery } from "@tanstack/react-query";
import { searchDeals } from "@/services/pipeline/search_deals";

/** IDs of the deals matching `search`, or undefined while idle/loading. */
export const useSearchDeals = (search: string) => {
  const term = search.trim();
  return useQuery({
    queryKey: ["deals", "search", term],
    queryFn: () => searchDeals(term),
    enabled: term.length > 0,
    select: (deals) =>
      new Set(deals.map((d) => d._id ?? d.id).filter(Boolean) as string[]),
  });
};
