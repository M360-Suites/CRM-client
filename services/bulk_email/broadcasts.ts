/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/services/apiclient";
import {
	AudiencePreview,
	Broadcast,
	BroadcastAudience,
	BroadcastPayload,
	BroadcastRecipient,
	BroadcastStatus,
	Paginated,
	RecipientStatus,
	TestSendResult,
} from "@/types/bulk_email";
import { compact, toEntity, toPaginated, unwrap } from "./normalize";

export const GetBroadcasts = async (params: {
	status?: BroadcastStatus;
	search?: string;
	page?: number;
	limit?: number;
}): Promise<Paginated<Broadcast>> => {
	const res = await apiClient.get<unknown>("/broadcasts", true, params);
	return toPaginated<Broadcast>(unwrap(res), "broadcasts", params.page, params.limit);
};

export const GetBroadcast = async (id: string) =>
	toEntity<Broadcast>(unwrap(await apiClient.get<unknown>(`/broadcasts/${id}`)), "broadcast");

export const CreateBroadcast = async (payload: BroadcastPayload) =>
	toEntity<Broadcast>(
		unwrap(await apiClient.post<unknown>("/broadcasts", compact(payload))),
		"broadcast",
	);

export const UpdateBroadcast = async ({
	id,
	payload,
}: {
	id: string;
	payload: BroadcastPayload;
}) => unwrap(await apiClient.patch<unknown>(`/broadcasts/${id}`, compact(payload)));

export const DeleteBroadcast = async (id: string) =>
	unwrap(await apiClient.delete<unknown>(`/broadcasts/${id}`));

// Omit scheduled_at to send now
export const SendBroadcast = async ({
	id,
	scheduled_at,
}: {
	id: string;
	scheduled_at?: string;
}) =>
	unwrap(
		await apiClient.post<Broadcast>(
			`/broadcasts/${id}/send`,
			scheduled_at ? { scheduled_at } : {},
		),
	);

export const CancelBroadcast = async (id: string) =>
	unwrap(await apiClient.post<Broadcast>(`/broadcasts/${id}/cancel`, {}));

// Goes to the signed-in user unless `to` lists up to 5 organization members
export const TestBroadcast = async ({ id, to }: { id: string; to?: string[] }) =>
	(unwrap(
		await apiClient.post<TestSendResult>(
			`/broadcasts/${id}/test`,
			to?.length ? { to } : {},
		),
	) ?? {}) as TestSendResult;

export const PreviewAudience = async (
	audience: BroadcastAudience,
): Promise<AudiencePreview> => {
	const data = unwrap(
		await apiClient.post<any>("/broadcasts/audience/preview", { audience }),
	);
	return {
		count: Number(data?.count ?? 0),
		opted_out: Number(data?.opted_out ?? 0),
		sample: data?.sample ?? [],
	};
};

export const GetBroadcastRecipients = async ({
	id,
	...params
}: {
	id: string;
	status?: RecipientStatus;
	search?: string;
	page?: number;
	limit?: number;
}): Promise<Paginated<BroadcastRecipient>> => {
	const res = await apiClient.get<unknown>(`/broadcasts/${id}/recipients`, true, params);
	return toPaginated<BroadcastRecipient>(unwrap(res), "recipients", params.page, params.limit);
};
