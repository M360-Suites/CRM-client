import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editFolder, EditFolderPayload } from "@/services/document/edit_folder";
import { toast } from "sonner";

export const useEditFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditFolderPayload }) =>
      editFolder(id, data),
    onSuccess: (response) => {
      if (response.status) {
        toast.success(response.message || "Folder updated successfully");
        queryClient.invalidateQueries({ queryKey: ["folders"] });
      } else {
        toast.error(response.message || "Failed to update folder");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update folder");
    },
  });
};
