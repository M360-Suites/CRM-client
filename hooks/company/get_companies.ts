import { useQuery } from "@tanstack/react-query";
import { GetCompanies } from "@/services/company/get_companies";
import { Company } from "@/types/company";

export const useGetCompanies = () => {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: GetCompanies,
    refetchInterval: 1 * 60 * 1000,
  });
};
