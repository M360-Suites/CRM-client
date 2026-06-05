import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkImportCompanies } from "@/services/company/bulk_companies";
import { useCompanyStore } from "@/stores/company/company_store";
import { toast } from "sonner";

export const useCompanyBulkImport = () => {
  const queryClient = useQueryClient();
  const { setImportSteps, setCompletedSteps } = useCompanyStore();

  const mutation = useMutation({
    mutationFn: BulkImportCompanies,
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["companies"] });
        setCompletedSteps([1, 2, 3]);
        setImportSteps(4);
      } else {
        toast.error(data.message);
      }
    },
  });

  return mutation;
};
