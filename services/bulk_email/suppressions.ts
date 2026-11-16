/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/services/apiclient";
import { SuppressionPage, SuppressionReason } from "@/types/bulk_email";
import { toPaginated, unwrap } from "./normalize";

export const GetSuppressions = async (params: {
	reason?: SuppressionReason;
	search?: string;
	page?: number;
	limit?: number;
}): Promise<SuppressionPage> => {
	const data = unwrap(await apiClient.get<any>("/email-suppressions", true, params));
	return {
		...toPaginated(data, "data", params.page, params.limit),
		counts: {
			unsubscribed: Number(data?.counts?.unsubscribed ?? 0),
			bounced: Number(data?.counts?.bounced ?? 0),
			complained: Number(data?.counts?.complained ?? 0),
		},
	};
};

// Lets the contact receive broadcasts and trigger emails again
export const RemoveSuppression = async (contactId: string) =>
	unwrap(await apiClient.delete<unknown>(`/email-suppressions/${contactId}`));
