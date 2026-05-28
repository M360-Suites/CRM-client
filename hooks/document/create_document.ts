import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createFolder } from "@/services/document/create_folder";
import { AddDocumentRequestData } from "@/validation/document";
import { toast } from "sonner";

export default function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddDocumentRequestData) => createFolder(data),
    onSuccess: (data) => {
      toast.success(data.message || "Folder created successfully");
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: () => {
      toast.error("Failed to create folder");
    },
  });
}
