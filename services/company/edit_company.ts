import { apiClient } from "../apiclient";
import { AddCompanyRequestData } from "@/validation/company";

export const EditCompany = async (
  data: Partial<AddCompanyRequestData> & { _id: string },
) => {
  const payload: Record<string, any> = {};

  if (data.companyName !== undefined) payload.name = data.companyName;
  if (data.companyAddress !== undefined) payload.address = data.companyAddress;
  if (data.industry !== undefined) payload.industry = data.industry;
  if (data.website !== undefined) payload.website = data.website;
  if (data.contactPerson !== undefined)
    payload.contact_person = data.contactPerson;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;

  const response = apiClient.patch(`/companies/${data._id}`, payload);
  return response;
};
