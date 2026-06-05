import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteFile } from "@/services/document/delete_file";
import { toast } from "sonner";

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => DeleteFile(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["folders"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to delete file");
    },
  });
};
