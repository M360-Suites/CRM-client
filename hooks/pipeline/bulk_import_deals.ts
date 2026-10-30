import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkImportDeals } from "@/services/pipeline/bulk_import_deals";
import { toast } from "sonner";

export const useDealBulkImport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BulkImportDeals,
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["pipeline"] });
        queryClient.invalidateQueries({ queryKey: ["deals"] });
      } else {
        toast.error(data.message || "Failed to import deals");
      }
    },
  });
};
