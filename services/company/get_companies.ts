import { apiClient } from "../apiclient";
import { Company, CompanyResponse } from "@/types/company";

interface GetCompaniesProps {
  page?: number;
  limit?: number;
}

export const GetCompanies = async (props: GetCompaniesProps) => {
  const response = await apiClient.get(`/companies`, true, {
    page: props.page,
    limit: props.limit,
  });
  return response.data as CompanyResponse;
};
