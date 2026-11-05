import deleteCommentByStage from "@/services/pipeline/comment/delete_comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { stageId: string; messageId: string }) =>
      deleteCommentByStage(variables.stageId, variables.messageId),
    onSuccess: (data, variables) => {
      if (data.status) {
        queryClient.invalidateQueries({
          queryKey: ["comments", variables.stageId],
        });
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });
}
