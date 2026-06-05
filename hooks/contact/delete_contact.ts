import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteContact } from "@/services/contact/delete_contact";
import { toast } from "sonner";

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteContact(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });
};
