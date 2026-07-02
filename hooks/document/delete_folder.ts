import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteFolder } from "@/services/document/delete_folder";
import { toast } from "sonner";

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteFolder(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["folders"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
