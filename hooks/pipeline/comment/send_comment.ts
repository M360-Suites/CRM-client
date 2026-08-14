import addCommentByStage from "@/services/pipeline/comment/send_comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { stageId: string; content: string }) =>
      addCommentByStage(variables.stageId, variables.content),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });
}
