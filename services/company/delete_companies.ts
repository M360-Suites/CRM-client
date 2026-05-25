import { apiClient } from "../apiclient";

export const DeleteCompany = async (id: string) => {
  const response = await apiClient.delete(`/companies/${id}`);
  return response;
};
