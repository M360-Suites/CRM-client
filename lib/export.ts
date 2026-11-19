import { AxiosError } from "axios";
import { authInstance } from "@/services/apiclient";

type ExportFormat = "csv" | "json";

interface PagedResponse<T> {
	data: T[];
	total_pages: number;
}

const EXPORT_PAGE_SIZE = 100;

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	// Give the browser a moment to start the download before revoking.
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function filenameFromDisposition(header: unknown, fallback: string) {
	if (typeof header !== "string") return fallback;
	const match =
		header.match(/filename\*=UTF-8''([^;]+)/i) ??
		header.match(/filename="?([^";]+)"?/i);
	return match ? decodeURIComponent(match[1]) : fallback;
}

/**
 * Downloads `/{resource}/export?format=...` from the backend.
 * Returns false when the backend doesn't support that export (4xx), so the
 * caller can fall back to building the file on the client.
 */
async function downloadServerExport(
	resource: string,
	format: ExportFormat,
): Promise<boolean> {
	try {
		const res = await authInstance.get<Blob>(`/${resource}/export`, {
			params: { format },
			responseType: "blob",
		});
		const filename = filenameFromDisposition(
			res.headers["content-disposition"],
			`${resource}.${format}`,
		);
		downloadBlob(res.data, filename);
		return true;
	} catch (error) {
		const status = (error as AxiosError).response?.status;
		if (status && status >= 400 && status < 500 && status !== 401) {
			return false;
		}
		throw error;
	}
}

/** Walks every page of a paginated list endpoint and returns all rows, de-duplicated by _id. */
async function fetchAllPages<T extends { _id?: string }>(
	fetchPage: (page: number, limit: number) => Promise<PagedResponse<T>>,
): Promise<T[]> {
	const first = await fetchPage(1, EXPORT_PAGE_SIZE);
	if (!first?.data) throw new Error("Failed to load records for export");

	const totalPages = Number(first.total_pages) || 1;
	const rest = await Promise.all(
		Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) =>
			fetchPage(i + 2, EXPORT_PAGE_SIZE),
		),
	);
	if (rest.some((r) => !r?.data)) {
		throw new Error("Failed to load records for export");
	}

	const seen = new Set<string>();
	return [first.data, ...rest.map((r) => r.data)].flat().filter((row) => {
		if (!row._id) return true;
		if (seen.has(row._id)) return false;
		seen.add(row._id);
		return true;
	});
}

function toCsvCell(value: unknown): string {
	if (value === null || value === undefined) return "";
	const text = typeof value === "object" ? JSON.stringify(value) : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

function downloadRows<T extends object>(
	rows: T[],
	format: ExportFormat,
	baseName: string,
) {
	if (format === "json") {
		downloadBlob(
			new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }),
			`${baseName}.json`,
		);
		return;
	}

	// Union of keys so rows with extra/missing fields stay aligned.
	const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
	const lines = rows.map((r) =>
		headers
			.map((h) => toCsvCell((r as Record<string, unknown>)[h]))
			.join(","),
	);
	const csv = [headers.map(toCsvCell).join(","), ...lines].join("\n");
	downloadBlob(new Blob([csv], { type: "text/csv" }), `${baseName}.csv`);
}

/**
 * Exports every record of a resource. Uses the backend export endpoint, and
 * falls back to paging through the list endpoint if that isn't available.
 * Returns false if there was nothing to export.
 */
export async function exportResource<T extends { _id?: string }>(
	resource: string,
	format: ExportFormat,
	fetchPage: (page: number, limit: number) => Promise<PagedResponse<T>>,
): Promise<boolean> {
	if (await downloadServerExport(resource, format)) return true;

	const rows = await fetchAllPages(fetchPage);
	if (!rows.length) return false;
	downloadRows(rows, format, resource);
	return true;
}
