import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteAssignedUser } from "@/services/pipeline/delete_user_from_stage";
import { toast } from "sonner";

interface DeleteAssignedUserData {
	stageId: string;
	userId: string;
}

export const useDeleteAssigned = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: DeleteAssignedUserData) => DeleteAssignedUser(data),
		onSuccess: async (data) => {
			if (data.status) {
				toast.success(data.message);
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: ["pipeline"] }),
					queryClient.invalidateQueries({ queryKey: ["deals"] }),
				]);
			} else {
				toast.error(data.message);
			}
		},
		onError: () => {
			toast.error("Failed to delete assigned user");
		},
	});
};
