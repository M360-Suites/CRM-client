import editCommentByStage from "@/services/pipeline/comment/edit_comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useEditComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      stageId: string;
      messageId: string;
      content: string;
      mentions?: string[];
    }) =>
      editCommentByStage(
        variables.stageId,
        variables.messageId,
        variables.content,
        variables.mentions ?? [],
      ),
    onSuccess: (data, variables) => {
      if (data.status) {
        queryClient.invalidateQueries({
          queryKey: ["comments", variables.stageId],
        });
      } else {
        toast.error(data.message || "Failed to edit comment");
      }
    },
    onError: () => {
      toast.error("Failed to edit comment");
    },
  });
}
