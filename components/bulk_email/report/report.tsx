"use client";

import { useState } from "react";
import Link from "next/link";
import { Ban, ChevronLeft, Search } from "lucide-react";
import {
	useBroadcast,
	useBroadcastRecipients,
	useCancelBroadcast,
} from "@/hooks/bulk_email/broadcasts";
import { useDebounced } from "@/hooks/bulk_email/use_debounced";
import { formatRelativeDateTime } from "@/lib/utils";
import { BroadcastStats, RecipientStatus } from "@/types/bulk_email";
import {
	RECIPIENT_STATUS_STYLES,
	STATUS_STYLES,
	audienceSummary,
	personName,
} from "../data";
import Pager from "../pager";
import { ReportSkeleton, TableRowsSkeleton } from "../skeletons";

const PAGE_SIZE = 20;

const STAT_CARDS: { key: keyof BroadcastStats; label: string }[] = [
	{ key: "total", label: "Recipients" },
	{ key: "sent", label: "Delivered" },
	{ key: "bounced", label: "Bounced" },
	{ key: "complained", label: "Complaints" },
	{ key: "failed", label: "Failed" },
	{ key: "skipped", label: "Skipped" },
];

const FILTERS: { label: string; value: RecipientStatus | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Sent", value: "sent" },
	{ label: "Queued", value: "queued" },
	{ label: "Bounced", value: "bounced" },
	{ label: "Complained", value: "complained" },
	{ label: "Failed", value: "failed" },
	{ label: "Skipped", value: "skipped" },
];

export default function BroadcastReport({ id }: { id: string }) {
	const { data: broadcast, isLoading, isError } = useBroadcast(id);
	const cancel = useCancelBroadcast();
	const [status, setStatus] = useState<RecipientStatus | "all">("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const term = useDebounced(search.trim());

	const recipients = useBroadcastRecipients({
		id,
		status: status === "all" ? undefined : status,
		search: term || undefined,
		page,
		limit: PAGE_SIZE,
	});
	// Skeletons also cover a new search, filter or page while it loads
	const recipientsLoading = recipients.isLoading || recipients.isPlaceholderData;
	const rows = recipientsLoading ? [] : (recipients.data?.data ?? []);

	if (isLoading) return <ReportSkeleton />;
	if (isError || !broadcast) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<span className="text-base text-foreground">
					This email couldn&apos;t be found
				</span>
				<Link href="/bulk-email" className="text-sm text-[#0091FE] hover:underline">
					Back to Bulk Email
				</Link>
			</div>
		);
	}

	const stats = broadcast.stats ?? {};
	const cancellable =
		broadcast.status === "scheduled" || broadcast.status === "sending";
	const when =
		broadcast.completed_at ?? broadcast.started_at ?? broadcast.scheduled_at;

	return (
		<div className="w-full flex flex-col gap-8 pt-8 pb-8">
			<div className="flex max-md:flex-col max-md:items-start gap-4 items-center justify-between">
				<div className="flex items-start gap-3 min-w-0">
					<Link
						href="/bulk-email"
						aria-label="Back"
						className="mt-1 p-1 rounded hover:bg-gray-100"
					>
						<ChevronLeft size={16} color="#94A3B8" />
					</Link>
					<div className="flex flex-col gap-1 min-w-0">
						<div className="flex items-center gap-3">
							<h2 className="xl:text-2xl text-lg font-medium text-[#3A2418] truncate">
								{broadcast.name}
							</h2>
							<span
								className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${STATUS_STYLES[broadcast.status] ?? STATUS_STYLES.draft}`}
							>
								{broadcast.status}
							</span>
						</div>
						<span className="text-sm text-foreground truncate">
							{broadcast.subject}
						</span>
						<span className="text-xs text-[#64748B]">
							To {audienceSummary(broadcast.audience).label.toLowerCase()}
							{when &&
								` · ${broadcast.status === "scheduled" ? "Scheduled for" : "Sent"} ${formatRelativeDateTime(when)}`}
							{personName(broadcast.sent_by ?? broadcast.created_by) &&
								` by ${personName(broadcast.sent_by ?? broadcast.created_by)}`}
						</span>
					</div>
				</div>
				{cancellable && (
					<button
						onClick={() => cancel.mutate(id)}
						disabled={cancel.isPending}
						className="flex items-center gap-2 rounded-full border border-[#FCD34D] bg-[#FFFBEB] px-4 py-2 text-sm text-[#B45309] hover:bg-amber-100 cursor-pointer disabled:opacity-60"
					>
						<Ban size={14} />
						Cancel send
					</button>
				)}
			</div>

			{broadcast.error && (
				<div className="rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
					{broadcast.error}
				</div>
			)}

			<div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
				{STAT_CARDS.map(({ key, label }) => (
					<div
						key={key}
						className="flex flex-col gap-1 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-4"
					>
						<span className="text-xs text-[#64748B]">{label}</span>
						<span className="text-2xl font-medium text-[#0F172A]">
							{stats[key] ?? 0}
						</span>
					</div>
				))}
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex max-lg:flex-col max-lg:items-start gap-3 items-center justify-between">
					<div className="border border-[#D9E1E8] md:w-sm w-full rounded-full bg-[#F2F7FB] flex items-center gap-2 py-2.5 px-4">
						<Search color="#3A2418" size={18} />
						<input
							type="text"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setPage(1);
							}}
							placeholder="Search recipients..."
							className="flex-1 text-sm outline-0"
						/>
					</div>
					<div className="flex items-center gap-1 overflow-x-auto max-w-full">
						{FILTERS.map((f) => (
							<button
								key={f.value}
								onClick={() => {
									setStatus(f.value);
									setPage(1);
								}}
								className={`rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap cursor-pointer ${
									f.value === status
										? "bg-[#0091FE] text-white"
										: "bg-[#F2F7FB] text-[#334155] border border-[#D9E1E8] hover:bg-gray-200"
								}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>

				<div className="w-full overflow-x-auto">
					<table className="w-full min-w-[720px] text-left">
						<thead className="bg-[#F1F5F9]">
							<tr className="text-[11px] font-medium tracking-wider text-[#334155] uppercase">
								<th className="py-4 px-4 font-medium">Contact</th>
								<th className="py-4 px-4 font-medium">Email</th>
								<th className="py-4 px-4 font-medium">Status</th>
								<th className="py-4 px-4 font-medium">Details</th>
								<th className="py-4 px-4 font-medium">Updated</th>
							</tr>
						</thead>
						<tbody>
							{recipientsLoading && <TableRowsSkeleton cols={5} />}
							{rows.map((r) => {
								const at = r.sent_at;
								return (
									<tr key={r._id} className="border-b border-[#F1F5F9] last:border-b-0">
										<td className="py-3 px-4 text-[13px] text-[#0F172A]">
											{r.name || "—"}
										</td>
										<td className="py-3 px-4 text-[13px] text-[#334155]">
											{r.email || "—"}
										</td>
										<td className="py-3 px-4">
											<span
												className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${RECIPIENT_STATUS_STYLES[r.status] ?? RECIPIENT_STATUS_STYLES.queued}`}
											>
												{r.status}
											</span>
										</td>
										<td className="py-3 px-4 text-xs text-[#64748B] max-w-64 truncate">
											{r.error ?? ""}
										</td>
										<td className="py-3 px-4 text-xs text-[#64748B]">
											{at ? formatRelativeDateTime(at) : "—"}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{!recipientsLoading && rows.length === 0 && (
						<div className="flex justify-center py-12 text-sm text-foreground">
							{recipients.isError
								? "Couldn't load recipients"
								: "No recipients here yet"}
						</div>
					)}
				</div>

				<Pager
					page={recipients.data?.page ?? page}
					totalPages={recipients.data?.total_pages ?? 1}
					total={recipients.data?.total ?? 0}
					pageSize={PAGE_SIZE}
					shown={recipients.data?.data?.length ?? 0}
					noun="recipients"
					onPage={setPage}
				/>
			</div>
		</div>
	);
}
