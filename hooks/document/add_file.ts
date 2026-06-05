import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFiles } from "@/services/document/add_files";
import { toast } from "sonner";

interface AddFilesPayload {
  files: File[];
  folderId: string;
}

export const useAddFiles = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ files, folderId }: AddFilesPayload) =>
      addFiles(files, folderId),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["folders"] });
      } else {
        toast.error(data.message);
      }
    },
  });

  return mutation;
};
