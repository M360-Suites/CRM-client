"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// Page numbers around the current page, so long lists don't render 50 buttons
const pageWindow = (current: number, total: number) => {
	const start = Math.max(1, Math.min(current - 2, total - 4));
	const end = Math.min(total, start + 4);
	return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export default function Pager({
	page,
	totalPages,
	total,
	pageSize,
	shown,
	noun,
	onPage,
}: {
	page: number;
	totalPages: number;
	total: number;
	pageSize: number;
	shown: number;
	noun: string;
	onPage: (page: number) => void;
}) {
	if (total === 0) return null;
	const start = (page - 1) * pageSize;

	return (
		<div className="flex items-center justify-between gap-4 w-full">
			<span className="text-xs text-[#334155]">
				Showing {start + 1}-{start + shown} of {total} {noun}
			</span>
			<div className="flex items-center gap-2">
				<button
					aria-label="Previous page"
					onClick={() => onPage(page - 1)}
					disabled={page <= 1}
					className="p-1 text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
				>
					<ChevronLeft size={16} />
				</button>
				{pageWindow(page, totalPages).map((n) => (
					<button
						key={n}
						onClick={() => onPage(n)}
						className={`h-6 min-w-6 px-1 rounded text-xs cursor-pointer ${
							page === n
								? "border border-[#0091FE] text-[#0091FE]"
								: "text-[#334155] hover:bg-gray-100"
						}`}
					>
						{n}
					</button>
				))}
				<button
					aria-label="Next page"
					onClick={() => onPage(page + 1)}
					disabled={page >= totalPages}
					className="p-1 text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
				>
					<ChevronRight size={16} />
				</button>
			</div>
		</div>
	);
}
