import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddCompany } from "@/services/company/add_company";
import { toast } from "sonner";

export const useAddCompany = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AddCompany,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Company added successfully");
        queryClient.invalidateQueries({ queryKey: ["companies"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to add company");
    },
  });
  return mutation;
};
