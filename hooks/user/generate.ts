import { useMutation } from "@tanstack/react-query";
import { generateDraft } from "@/services/user/generate_draft";
import { toast } from "sonner";

export default function useGenerateDraft() {
  return useMutation({
    mutationFn: generateDraft,
    onSuccess: (data) => {
      toast.success(data.message || "Draft generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate draft");
    },
  });
}
