import { apiClient } from "../apiclient";
import { Company } from "@/types/company";

export const GetCompanies = async () => {
  const response = await apiClient.get("/companies");
  return response.data as Company[];
};
