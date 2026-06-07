import { useQuery } from "@tanstack/react-query";
import { GetCompanies } from "@/services/company/get_companies";
import { Company, CompanyResponse } from "@/types/company";

interface UseGetCompaniesProps {
  page?: number;
  limit?: number;
}

export const useGetCompanies = (props: UseGetCompaniesProps) => {
  return useQuery<CompanyResponse>({
    queryKey: ["companies", props?.page, props?.limit],
    queryFn: () => GetCompanies(props),
    refetchInterval: 1 * 60 * 1000,
  });
};
