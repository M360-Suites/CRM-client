import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditCompany } from "@/services/company/edit_company";
import { toast } from "sonner";

export const useEditCompany = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: EditCompany,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Company updated successfully");
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      } else {
        toast.error(data.message || "Failed to update company");
      }
    },
    onError: (data) => {
      toast.error(data.message || "Failed to update company");
    },
  });
  return mutation;
};
