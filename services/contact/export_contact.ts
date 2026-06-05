import { apiClient } from "../apiclient";
// import { Contact } from "@/types/contact";

export const exportContact = async (format?: string) => {
  const response = await apiClient.get(
    `/contacts/export?format=${format}`,
    true,
  );
  return response;
};
