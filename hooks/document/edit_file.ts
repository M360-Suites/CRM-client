import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editFile } from "@/services/document/edit_file";
import { toast } from "sonner";

interface EditFileVariables {
  id: string;
  name: string;
  folderId: string;
}

export const useEditFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: EditFileVariables) => editFile(id, name),
    onSuccess: (response, { folderId }) => {
      if (response.status) {
        toast.success(response.message || "File renamed successfully");
        queryClient.invalidateQueries({ queryKey: ["folders", folderId] });
      } else {
        toast.error(response.message || "Failed to rename file");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to rename file");
    },
  });
};
