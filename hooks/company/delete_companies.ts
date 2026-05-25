import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCompany } from "@/services/company/delete_companies";
import { toast } from "sonner";

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteCompany(id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => {
      toast.error("Failed to delete company");
    },
  });
};
