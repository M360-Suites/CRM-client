import { useMutation } from "@tanstack/react-query";
import { generateDraft } from "@/services/user/generate_draft";
import { toast } from "sonner";

export default function useGenerateDraft() {
  return useMutation({
    mutationFn: generateDraft,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Draft generated successfully");
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to generate draft");
    },
  });
}
