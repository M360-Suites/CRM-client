"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, LoaderCircle, MailCheck, Search } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/custom/common/customButton";
import {
	useRemoveSuppression,
	useSuppressions,
} from "@/hooks/bulk_email/suppressions";
import { useDebounced } from "@/hooks/bulk_email/use_debounced";
import { formatRelativeDateTime } from "@/lib/utils";
import { Suppression, SuppressionReason } from "@/types/bulk_email";
import Pager from "../pager";
import { TableRowsSkeleton } from "../skeletons";

const PAGE_SIZE = 20;

const REASONS: Record<SuppressionReason, { label: string; style: string }> = {
	unsubscribed: { label: "Unsubscribed", style: "bg-[#F1F5F9] text-[#334155]" },
	bounced: { label: "Bounced", style: "bg-[#FEF2F2] text-[#DC2626]" },
	complained: { label: "Complained", style: "bg-[#FFF7ED] text-[#C2410C]" },
};

const TABS: (SuppressionReason | "all")[] = [
	"all",
	"unsubscribed",
	"bounced",
	"complained",
];

// What re-enabling means for each reason, shown before confirming
const REENABLE_HINT: Record<SuppressionReason, string> = {
	unsubscribed: "Only do this if they asked to receive your emails again.",
	bounced: "Only do this if their email address has been corrected; sending to a dead address hurts delivery for everyone.",
	complained: "They marked a previous email as spam. Only do this if they explicitly asked to rejoin.",
};

function ReenableDialog({
	contact,
	onClose,
}: {
	contact: Suppression | null;
	onClose: () => void;
}) {
	const remove = useRemoveSuppression();
	const reason = contact?.reason ?? "unsubscribed";

	return (
		<Dialog open={!!contact} onOpenChange={(o) => !o && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-[420px] p-7 gap-0 flex flex-col items-start text-left rounded-2xl"
			>
				<DialogTitle className="text-lg font-normal text-[#334155]">
					Email {contact?.name || contact?.email} again?
				</DialogTitle>
				<DialogDescription className="mt-2 text-[13px] leading-5 text-[#64748B]">
					They&apos;ll be included in future broadcasts and trigger emails.{" "}
					{REENABLE_HINT[reason]}
				</DialogDescription>
				<div className="mt-6 flex w-full gap-3">
					<CustomButton
						variant="ghost"
						onClick={onClose}
						className="flex-1 rounded-lg min-h-10 text-[13px] font-normal"
					>
						Keep excluded
					</CustomButton>
					<CustomButton
						disabled={remove.isPending}
						onClick={() =>
							contact &&
							remove.mutate(contact.contact_id, { onSuccess: onClose })
						}
						className="flex-1 rounded-lg border-0 min-h-10 text-[13px] font-normal"
					>
						{remove.isPending && <LoaderCircle size={14} className="animate-spin" />}
						Allow emails
					</CustomButton>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default function Suppressions() {
	const [reason, setReason] = useState<SuppressionReason | "all">("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [reenable, setReenable] = useState<Suppression | null>(null);
	const term = useDebounced(search.trim());

	const { data, isLoading: firstLoad, isError, isPlaceholderData } = useSuppressions({
		reason: reason === "all" ? undefined : reason,
		search: term || undefined,
		page,
		limit: PAGE_SIZE,
	});
	// Skeletons also cover a new search, filter or page while it loads
	const isLoading = firstLoad || isPlaceholderData;
	const rows = isLoading ? [] : (data?.data ?? []);
	const counts = data?.counts;
	const allCount = counts
		? counts.unsubscribed + counts.bounced + counts.complained
		: undefined;

	return (
		<div className="w-full flex flex-col gap-8 pt-8 pb-8">
			<div className="flex items-start gap-3">
				<Link
					href="/bulk-email"
					aria-label="Back"
					className="mt-1 p-1 rounded hover:bg-gray-100"
				>
					<ChevronLeft size={16} color="#94A3B8" />
				</Link>
				<div className="flex flex-col gap-1">
					<h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium text-[#3A2418]">
						Suppressed contacts
					</h2>
					<span className="text-sm text-foreground">
						Contacts who unsubscribed, bounced or marked an email as spam.
						They&apos;re left out of every broadcast and trigger email.
					</span>
				</div>
			</div>

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
						placeholder="Search by name or email..."
						className="flex-1 text-sm outline-0"
					/>
				</div>
				<div className="flex items-center gap-1 overflow-x-auto max-w-full">
					{TABS.map((tab) => {
						const count = tab === "all" ? allCount : counts?.[tab];
						return (
							<button
								key={tab}
								onClick={() => {
									setReason(tab);
									setPage(1);
								}}
								className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap cursor-pointer ${
									tab === reason
										? "bg-[#0091FE] text-white"
										: "bg-[#F2F7FB] text-[#334155] border border-[#D9E1E8] hover:bg-gray-200"
								}`}
							>
								{tab === "all" ? "All" : REASONS[tab].label}
								{count !== undefined && (
									<span className={tab === reason ? "text-white/80" : "text-[#94A3B8]"}>
										{count}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			<div className="w-full overflow-x-auto">
				<table className="w-full min-w-[680px] text-left">
					<thead className="bg-[#F1F5F9]">
						<tr className="text-[11px] font-medium tracking-wider text-[#334155] uppercase">
							<th className="py-4 px-4 font-medium">Contact</th>
							<th className="py-4 px-4 font-medium">Email</th>
							<th className="py-4 px-4 font-medium">Reason</th>
							<th className="py-4 px-4 font-medium">Since</th>
							<th className="py-4 px-4 font-medium text-right">Action</th>
						</tr>
					</thead>
					<tbody>
						{isLoading && <TableRowsSkeleton cols={5} />}
						{rows.map((row) => (
							<tr key={row.contact_id} className="border-b border-[#F1F5F9] last:border-b-0">
								<td className="py-3 px-4 text-[13px] text-[#0F172A]">{row.name || "—"}</td>
								<td className="py-3 px-4 text-[13px] text-[#334155]">{row.email || "—"}</td>
								<td className="py-3 px-4">
									{row.reason && (
										<span
											className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${REASONS[row.reason].style}`}
										>
											{REASONS[row.reason].label}
										</span>
									)}
								</td>
								<td className="py-3 px-4 text-xs text-[#64748B]">
									{row.suppressed_at ? formatRelativeDateTime(row.suppressed_at) : "—"}
								</td>
								<td className="py-3 px-4 text-right">
									<button
										onClick={() => setReenable(row)}
										className="inline-flex items-center gap-1.5 rounded-full border border-[#D9E1E8] px-3 py-1 text-xs text-[#334155] hover:bg-gray-100 cursor-pointer"
									>
										<MailCheck size={14} />
										Allow emails
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{!isLoading && rows.length === 0 && (
					<div className="flex justify-center py-16 text-sm text-foreground">
						{isError
							? "Couldn't load suppressed contacts"
							: term
								? "No suppressed contacts match your search"
								: "No one is suppressed. Everyone in your audience can receive email."}
					</div>
				)}
			</div>

			<Pager
				page={data?.page ?? page}
				totalPages={data?.total_pages ?? 1}
				total={data?.total ?? 0}
				pageSize={PAGE_SIZE}
				shown={data?.data?.length ?? 0}
				noun="contacts"
				onPage={setPage}
			/>

			<ReenableDialog contact={reenable} onClose={() => setReenable(null)} />
		</div>
	);
}
