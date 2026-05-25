import { apiClient } from "../apiclient";
import { Company } from "@/types/company";

export const GetCompanyContacts = async (id: string) => {
  const response = await apiClient.get(`/companies/${id}/contacts`);
  return response.data as Company[];
};

export const GetCompanyDeals = async (id: string) => {
  const response = await apiClient.get(`/companies/${id}/deals`);
  return response.data as Company[];
};

export const GetCompanyStats = async (id: string) => {
  const response = await apiClient.get(`/companies/${id}/stats`);
  return response.data as Company[];
};
