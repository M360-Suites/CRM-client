/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/common";
import { MergeVariable, Paginated } from "@/types/bulk_email";

// Shared response helpers for the bulk email endpoints. The API's ID field is
// `id`; the UI reads `_id` like the rest of the app, so withId copies it over.

export const unwrap = <T>(res: ApiResponse<T>): T => {
	if (!res.status) throw new Error(res.message || "Something went wrong");
	return res.data as T;
};

// Records may carry `id` instead of `_id`, and may be wrapped as
// { broadcast: {...} } / { template: {...} }. The UI always reads `_id`.
export const withId = <T>(item: any): T =>
	item && typeof item === "object" && !item._id && item.id
		? { ...item, _id: String(item.id) }
		: item;

export const toEntity = <T>(data: any, key: string): T => {
	const item = withId<any>(data?.[key] ?? data);
	if (!item?._id) throw new Error("The server response was missing an id");
	return item as T;
};

// Empty strings fail backend validation; leave those fields out instead
export const compact = <T extends object>(payload: T): Partial<T> =>
	Object.fromEntries(
		Object.entries(payload).filter(
			([, v]) => v !== undefined && !(typeof v === "string" && v.trim() === ""),
		),
	) as Partial<T>;

export const toPaginated = <T>(
	data: any,
	key: string,
	page = 1,
	limit = 10,
): Paginated<T> => {
	const list: T[] = Array.isArray(data)
		? data
		: Array.isArray(data?.data)
			? data.data
			: Array.isArray(data?.[key])
				? data[key]
				: [];
	const meta = data?.pagination ?? data?.meta ?? data ?? {};
	const total = Number(meta.total ?? list.length) || 0;
	const lim = Number(meta.limit ?? limit) || limit;
	return {
		data: list.map((item) => withId<T>(item)),
		page: Number(meta.page ?? page) || page,
		limit: lim,
		total,
		total_pages:
			Number(meta.total_pages ?? meta.totalPages) ||
			Math.max(1, Math.ceil(total / lim)),
	};
};

// Variables may come back as ["contact.first_name"], [{ tag, label }],
// or grouped: { contact: [...], deal: [...] }.
export const toVariables = (data: any): MergeVariable[] => {
	const one = (v: any): MergeVariable | null => {
		if (typeof v === "string") return { tag: stripBraces(v), label: v };
		if (v && typeof v === "object") {
			const tag = v.tag ?? v.key ?? v.value ?? v.name ?? v.variable;
			if (!tag) return null;
			return {
				tag: stripBraces(String(tag)),
				label: String(v.label ?? v.description ?? v.name ?? tag),
			};
		}
		return null;
	};
	const list = Array.isArray(data)
		? data
		: Array.isArray(data?.variables)
			? data.variables
			: data && typeof data === "object"
				? Object.values(data).flat()
				: [];
	return list.map(one).filter((v: MergeVariable | null): v is MergeVariable => !!v);
};

const stripBraces = (tag: string) => tag.replace(/^\{\{\s*|\s*\}\}$/g, "");
