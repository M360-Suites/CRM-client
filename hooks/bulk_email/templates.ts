import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { EmailTemplate } from "@/types/bulk_email";
import {
	CreateEmailTemplate,
	DeleteEmailTemplate,
	DuplicateEmailTemplate,
	GetEmailTemplate,
	GetEmailTemplates,
	GetMergeVariables,
	TestEmailTemplate,
	UpdateEmailTemplate,
} from "@/services/bulk_email/templates";

const onError = (err: Error) => toast.error(err.message);

export const useEmailTemplates = (params: {
	search?: string;
	page?: number;
	limit?: number;
}) =>
	useQuery({
		queryKey: ["email-templates", params],
		queryFn: () => GetEmailTemplates(params),
		placeholderData: keepPreviousData,
	});

export const useEmailTemplate = (id?: string) =>
	useQuery({
		queryKey: ["email-template", id],
		queryFn: () => GetEmailTemplate(id!),
		enabled: !!id,
	});

export const useMergeVariables = () =>
	useQuery({
		queryKey: ["email-template-variables"],
		queryFn: GetMergeVariables,
		staleTime: 30 * 60 * 1000,
	});

export const useCreateEmailTemplate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: CreateEmailTemplate,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["email-templates"] }),
		onError,
	});
};

// Autosave: keep the detail cache in sync without refetching mid-edit
export const useUpdateEmailTemplate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: UpdateEmailTemplate,
		onSuccess: (_data, { id, payload }) => {
			// Reopening the editor reads this cache, so keep it current
			queryClient.setQueryData<EmailTemplate>(["email-template", id], (old) =>
				old ? { ...old, ...payload } : old,
			);
			queryClient.invalidateQueries({
				queryKey: ["email-templates"],
				refetchType: "none",
			});
		},
		onError,
	});
};

export const useDeleteEmailTemplate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: DeleteEmailTemplate,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["email-templates"] }),
		onError,
	});
};

export const useDuplicateEmailTemplate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: DuplicateEmailTemplate,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["email-templates"] }),
		onError,
	});
};

export const useTestEmailTemplate = () =>
	useMutation({
		mutationFn: TestEmailTemplate,
		onSuccess: () => toast.success("Test email sent to your inbox"),
		onError,
	});
