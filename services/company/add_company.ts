import { apiClient } from "../apiclient";
import { AddCompanyRequestData } from "@/validation/company";

export const AddCompany = async (data: AddCompanyRequestData) => {
  const response = await apiClient.post("/companies", {
    name: data.companyName,
    address: data.companyAddress,
    industry: data.industry,
    website: data.website,
    contact_person: data.contactPerson,
    email: data.email,
    phone: data.phone,
  });
  return response;
};
