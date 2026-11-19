import { downloadFile } from "@/lib/handler";

interface PagedResponse<T> {
	data: T[];
	total_pages: number;
}

const EXPORT_PAGE_SIZE = 100;

/** Walks every page of a paginated list endpoint and returns all rows. */
export async function fetchAllPages<T>(
	fetchPage: (page: number, limit: number) => Promise<PagedResponse<T>>,
): Promise<T[]> {
	const first = await fetchPage(1, EXPORT_PAGE_SIZE);
	if (!first?.data) throw new Error("Failed to load records for export");

	const totalPages = Number(first.total_pages) || 1;
	if (totalPages <= 1) return first.data;

	const rest = await Promise.all(
		Array.from({ length: totalPages - 1 }, (_, i) =>
			fetchPage(i + 2, EXPORT_PAGE_SIZE),
		),
	);
	if (rest.some((r) => !r?.data)) {
		throw new Error("Failed to load records for export");
	}

	return [first.data, ...rest.map((r) => r.data)].flat();
}

function toCsvCell(value: unknown): string {
	if (value === null || value === undefined) return "";
	const text = typeof value === "object" ? JSON.stringify(value) : String(value);
	return `"${text.replace(/"/g, '""')}"`;
}

export function exportRows<T extends object>(
	rows: T[],
	format: "csv" | "json",
	baseName: string,
) {
	if (format === "json") {
		downloadFile(
			JSON.stringify(rows, null, 2),
			`${baseName}.json`,
			"application/json",
		);
		return;
	}

	// Union of keys so rows with extra/missing fields stay aligned.
	const headers = Array.from(
		new Set(rows.flatMap((r) => Object.keys(r))),
	);
	const lines = rows.map((r) =>
		headers
			.map((h) => toCsvCell((r as Record<string, unknown>)[h]))
			.join(","),
	);
	const csv = [headers.map(toCsvCell).join(","), ...lines].join("\n");
	downloadFile(csv, `${baseName}.csv`, "text/csv");
}
