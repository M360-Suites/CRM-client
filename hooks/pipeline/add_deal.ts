import addDeal from "@/services/pipeline/add_deal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useAddDeal() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addDeal,
		onSuccess: (data) => {
			toast.success(data.message || "Deal added successfully");
			queryClient.invalidateQueries({ queryKey: ["pipeline"] });
		},
		onError: () => {
			toast.error("Failed to add deal");
		},
	});
}
