import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
	CancelBroadcast,
	CreateBroadcast,
	DeleteBroadcast,
	GetBroadcast,
	GetBroadcastRecipients,
	GetBroadcasts,
	PreviewAudience,
	SendBroadcast,
	TestBroadcast,
	UpdateBroadcast,
} from "@/services/bulk_email/broadcasts";
import {
	Broadcast,
	BroadcastAudience,
	BroadcastStatus,
	RecipientStatus,
} from "@/types/bulk_email";

const onError = (err: Error) => toast.error(err.message);

export const useBroadcasts = (params: {
	status?: BroadcastStatus;
	search?: string;
	page?: number;
	limit?: number;
}) =>
	useQuery({
		queryKey: ["broadcasts", params],
		queryFn: () => GetBroadcasts(params),
		placeholderData: keepPreviousData,
	});

// Poll while a broadcast is going out so the stats move
export const useBroadcast = (id?: string) =>
	useQuery({
		queryKey: ["broadcast", id],
		queryFn: () => GetBroadcast(id!),
		enabled: !!id,
		refetchInterval: (query) =>
			query.state.data?.status === "sending" ? 5000 : false,
	});

export const useBroadcastRecipients = (params: {
	id: string;
	status?: RecipientStatus;
	search?: string;
	page?: number;
	limit?: number;
}) =>
	useQuery({
		queryKey: ["broadcast-recipients", params],
		queryFn: () => GetBroadcastRecipients(params),
		placeholderData: keepPreviousData,
	});

export const useAudiencePreview = (audience: BroadcastAudience) =>
	useQuery({
		queryKey: ["broadcast-audience", audience],
		queryFn: () => PreviewAudience(audience),
		staleTime: 60 * 1000,
	});

export const useCreateBroadcast = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: CreateBroadcast,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["broadcasts"] }),
		onError,
	});
};

export const useUpdateBroadcast = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: UpdateBroadcast,
		onSuccess: (_data, { id, payload }) => {
			// Reopening the editor reads this cache, so keep it current
			queryClient.setQueryData<Broadcast>(["broadcast", id], (old) =>
				old ? { ...old, ...payload } : old,
			);
			queryClient.invalidateQueries({
				queryKey: ["broadcasts"],
				refetchType: "none",
			});
		},
		onError,
	});
};

export const useDeleteBroadcast = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: DeleteBroadcast,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["broadcasts"] }),
		onError,
	});
};

export const useSendBroadcast = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: SendBroadcast,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
			queryClient.invalidateQueries({ queryKey: ["broadcast"] });
		},
		onError,
	});
};

export const useCancelBroadcast = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: CancelBroadcast,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
			queryClient.invalidateQueries({ queryKey: ["broadcast"] });
			toast.success("Broadcast cancelled");
		},
		onError,
	});
};

export const useTestBroadcast = () =>
	useMutation({
		mutationFn: TestBroadcast,
		onSuccess: (res) =>
			toast.success(
				res.sent_to?.length
					? `Test email sent to ${res.sent_to.join(", ")}`
					: "Test email sent to your inbox",
			),
		onError,
	});
