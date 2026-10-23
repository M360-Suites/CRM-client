import {
  GetAssignmentSettings,
  updateAssignmentSettings,
} from "@/services/org/assignment_settings";
import { AssignmentMode } from "@/types/pipeline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const assignmentSettingsQueryKey = ["org", "assignment-settings"];

export const useGetAssignmentMode = () => {
  return useQuery<AssignmentMode>({
    queryKey: assignmentSettingsQueryKey,
    queryFn: () => GetAssignmentSettings(),
  });
};

export const useUpdateAssignmentMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAssignmentSettings,
    onMutate: async (mode: AssignmentMode) => {
      await queryClient.cancelQueries({ queryKey: assignmentSettingsQueryKey });
      const previous = queryClient.getQueryData<AssignmentMode>(
        assignmentSettingsQueryKey,
      );
      queryClient.setQueryData(assignmentSettingsQueryKey, mode);
      return { previous };
    },
    onSuccess: (data, mode, context) => {
      if (data.status) {
        toast.success(
          data.message ||
            (mode === "auto" ? "Auto-assign turned on" : "Auto-assign turned off"),
        );
        queryClient.invalidateQueries({ queryKey: assignmentSettingsQueryKey });
      } else {
        queryClient.setQueryData(assignmentSettingsQueryKey, context?.previous);
        toast.error(data.message || "Failed to update auto-assign");
      }
    },
    onError: (_error, _mode, context) => {
      queryClient.setQueryData(assignmentSettingsQueryKey, context?.previous);
      toast.error("Failed to update auto-assign");
    },
  });
};
