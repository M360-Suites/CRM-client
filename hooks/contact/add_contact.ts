import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddContact } from "@/services/contact/add_contacts";
import { toast } from "sonner";

export const useAddContact = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AddContact,
    onSuccess: (data) => {
      toast.success(data.message || "Contact added successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      toast.error("Failed to add contact");
    },
  });
  return mutation;
};
