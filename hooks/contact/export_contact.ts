import { useQuery } from "@tanstack/react-query";
import { exportContact } from "@/services/contact/export_contact";
// import { Contact } from "@/types/contact";

export const useExportContacts = (format?: string) => {
  return useQuery({
    queryKey: ["contacts", format],
    queryFn: () => exportContact(format),
    refetchInterval: 1 * 60 * 1000,
  });
};
