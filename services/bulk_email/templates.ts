import { apiClient } from "@/services/apiclient";
import {
	EmailTemplate,
	EmailTemplatePayload,
	MergeVariable,
	Paginated,
} from "@/types/bulk_email";
import { compact, toEntity, toPaginated, toVariables, unwrap } from "./normalize";

export const GetEmailTemplates = async (params: {
	search?: string;
	page?: number;
	limit?: number;
}): Promise<Paginated<EmailTemplate>> => {
	const res = await apiClient.get<unknown>("/email-templates", true, params);
	return toPaginated<EmailTemplate>(unwrap(res), "templates", params.page, params.limit);
};

export const GetEmailTemplate = async (id: string) =>
	toEntity<EmailTemplate>(
		unwrap(await apiClient.get<unknown>(`/email-templates/${id}`)),
		"template",
	);

export const CreateEmailTemplate = async (payload: EmailTemplatePayload) =>
	toEntity<EmailTemplate>(
		unwrap(await apiClient.post<unknown>("/email-templates", compact(payload))),
		"template",
	);

export const UpdateEmailTemplate = async ({
	id,
	payload,
}: {
	id: string;
	payload: EmailTemplatePayload;
}) =>
	unwrap(await apiClient.patch<unknown>(`/email-templates/${id}`, compact(payload)));

export const DeleteEmailTemplate = async (id: string) =>
	unwrap(await apiClient.delete<unknown>(`/email-templates/${id}`));

export const DuplicateEmailTemplate = async (id: string) =>
	toEntity<EmailTemplate>(
		unwrap(await apiClient.post<unknown>(`/email-templates/${id}/duplicate`, {})),
		"template",
	);

export const TestEmailTemplate = async (id: string) =>
	unwrap(await apiClient.post<unknown>(`/email-templates/${id}/test`, {}));

export const GetMergeVariables = async (): Promise<MergeVariable[]> =>
	toVariables(unwrap(await apiClient.get<unknown>("/email-templates/variables")));

export const PreviewEmailTemplate = async (payload: {
	subject: string;
	html: string;
}) =>
	unwrap(
		await apiClient.post<{ subject?: string; html?: string }>(
			"/email-templates/preview",
			payload,
		),
	);
