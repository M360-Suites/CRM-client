import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkImportContacts } from "@/services/contact/bulk_contact";
import { useContactStore } from "@/stores/contact/contact_store";
import { toast } from "sonner";

export const useContactBulkImport = () => {
  const queryClient = useQueryClient();
  const { setImportSteps, setCompletedSteps } = useContactStore();

  const mutation = useMutation({
    mutationFn: BulkImportContacts,
    onSuccess: (data) => {
      if (data.status) {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        setCompletedSteps([1, 2, 3]);
        setImportSteps(4);
      } else {
        toast.error(data.message);
      }
    },
  });

  return mutation;
};
