import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditContact } from "@/services/contact/edit_contacts";
import { toast } from "sonner";

export const useEditContact = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: EditContact,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Contact uodated successfully");
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update contact");
    },
  });
  return mutation;
};
