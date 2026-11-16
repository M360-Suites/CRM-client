import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
	GetSuppressions,
	RemoveSuppression,
} from "@/services/bulk_email/suppressions";
import { SuppressionReason } from "@/types/bulk_email";

export const useSuppressions = (params: {
	reason?: SuppressionReason;
	search?: string;
	page?: number;
	limit?: number;
}) =>
	useQuery({
		queryKey: ["email-suppressions", params],
		queryFn: () => GetSuppressions(params),
		placeholderData: keepPreviousData,
	});

export const useRemoveSuppression = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: RemoveSuppression,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["email-suppressions"] });
			// Audience counts change when someone can be emailed again
			queryClient.invalidateQueries({ queryKey: ["broadcast-audience"] });
			toast.success("They'll receive emails again");
		},
		onError: (err: Error) => toast.error(err.message),
	});
};
