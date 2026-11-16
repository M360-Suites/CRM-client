"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	BarChart3,
	Ban,
	EllipsisVertical,
	MailOpen,
	PlusIcon,
	Search,
	Pencil,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomPopover } from "@/components/custom/common/customPopover";
import {
	useBroadcasts,
	useCancelBroadcast,
	useDeleteBroadcast,
} from "@/hooks/bulk_email/broadcasts";
import { useDebounced } from "@/hooks/bulk_email/use_debounced";
import { handleHoursTime } from "@/lib/utils";
import { Broadcast, BroadcastStatus } from "@/types/bulk_email";
import {
	EDITABLE_STATUSES,
	STATUS_STYLES,
	audienceSummary,
	personName,
} from "./data";
import Pager from "./pager";
import { BroadcastListSkeleton, TableRowsSkeleton } from "./skeletons";

const TABS: { label: string; value: BroadcastStatus | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Drafts", value: "draft" },
	{ label: "Scheduled", value: "scheduled" },
	{ label: "Sent", value: "sent" },
];

const PAGE_SIZE = 10;

export const broadcastHref = (b: Pick<Broadcast, "_id" | "status">) =>
	EDITABLE_STATUSES.includes(b.status)
		? `/bulk-email/new?id=${b._id}`
		: `/bulk-email/${b._id}`;

function EmptyState() {
	return (
		<div className="flex flex-col items-center text-center gap-4 py-24 px-4">
			<div className="rounded-full bg-[#E6F2FF] p-4">
				<MailOpen className="h-10 w-10" color="#0076D6" />
			</div>
			<h3 className="xl:text-[28px] text-xl font-normal text-[#0F172A] mt-4">
				Start sending mails that get noticed
			</h3>
			<p className="max-w-lg text-sm text-foreground">
				This is where your email strategy begins. CRM360 makes it simple
				to send mails that reflect your brand and resonate with your
				audience. Professional templates, easy editing, and delivery you
				can count on.
			</p>
			<CustomButton
				asChild
				variant="secondary"
				className="mt-2 flex flex-row items-center gap-2 px-5 py-2 text-sm text-white"
			>
				<Link href="/bulk-email/new">
					<PlusIcon />
					<span>New Mail</span>
				</Link>
			</CustomButton>
		</div>
	);
}

const menuItem =
	"flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer disabled:opacity-50";

function RowActions({ broadcast }: { broadcast: Broadcast }) {
	const router = useRouter();
	const remove = useDeleteBroadcast();
	const cancel = useCancelBroadcast();
	const editable = EDITABLE_STATUSES.includes(broadcast.status);
	const cancellable =
		broadcast.status === "scheduled" || broadcast.status === "sending";

	return (
		<CustomPopover
			trigger={
				<button
					aria-label="Email actions"
					className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
				>
					<EllipsisVertical size={16} color="#64748B" />
				</button>
			}
			className="pt-2 flex flex-col w-36"
			popoverClassname="bg-[#F7FAFC]"
		>
			{editable && (
				<button
					onClick={() => router.push(`/bulk-email/new?id=${broadcast._id}`)}
					className={`${menuItem} text-[#334155] hover:bg-gray-100`}
				>
					<Pencil size={14} />
					Edit
				</button>
			)}
			{broadcast.status !== "draft" && (
				<button
					onClick={() => router.push(`/bulk-email/${broadcast._id}`)}
					className={`${menuItem} text-[#334155] hover:bg-gray-100`}
				>
					<BarChart3 size={14} />
					View report
				</button>
			)}
			{cancellable && (
				<button
					disabled={cancel.isPending}
					onClick={() => cancel.mutate(broadcast._id)}
					className={`${menuItem} text-[#B45309] hover:bg-amber-50`}
				>
					<Ban size={14} />
					Cancel send
				</button>
			)}
			{broadcast.status === "draft" && (
				<button
					disabled={remove.isPending}
					onClick={() =>
						remove.mutate(broadcast._id, {
							onSuccess: () => toast.success("Draft deleted"),
						})
					}
					className={`${menuItem} text-[#DC2626] hover:bg-red-50`}
				>
					<Trash2 size={14} />
					Delete
				</button>
			)}
		</CustomPopover>
	);
}

export default function Body() {
	const [activeTab, setActiveTab] = useState<BroadcastStatus | "all">("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const term = useDebounced(search.trim());

	const { data, isLoading, isError, isPlaceholderData } = useBroadcasts({
		status: activeTab === "all" ? undefined : activeTab,
		search: term || undefined,
		page,
		limit: PAGE_SIZE,
	});
	// While a new tab, search or page loads, the old rows are swapped for skeletons
	const rows = isPlaceholderData ? [] : (data?.data ?? []);
	const filtered = activeTab !== "all" || !!term;

	if (isLoading) return <BroadcastListSkeleton />;
	if (!isError && !filtered && data?.total === 0) return <EmptyState />;

	return (
		<div className="w-full flex-col flex gap-8">
			<div className="flex max-lg:flex-col max-lg:gap-3 max-lg:items-start items-center justify-between w-full">
				<div className="border border-[#D9E1E8] xl:w-xl md:w-sm w-full rounded-full text-[#3A2418] bg-[#F2F7FB] flex flex-row items-center gap-2 py-3 px-4">
					<Search color="#3A2418" size={20} />
					<input
						type="text"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						placeholder="Search email titles or subject lines..."
						className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0"
					/>
				</div>
				<div className="flex flex-row items-center gap-1 py-2 overflow-x-auto max-w-full">
					{TABS.map((tab) => (
						<button
							key={tab.value}
							className={`rounded-full ${tab.value === "all" ? "px-8" : "px-4"} cursor-pointer xl:text-base text-sm font-normal py-2 ${
								tab.value === activeTab
									? "bg-[#0091FE] text-white"
									: "bg-[#F2F7FB] text-[#334155] border border-[#D9E1E8] hover:bg-gray-200 transition-colors"
							}`}
							onClick={() => {
								setActiveTab(tab.value);
								setPage(1);
							}}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className="w-full overflow-x-auto">
				<table className="w-full min-w-[860px] text-left">
					<thead className="bg-[#F1F5F9]">
						<tr className="text-[11px] font-medium tracking-wider text-[#334155] uppercase">
							<th className="py-5 px-4 font-medium text-center w-48">Email title</th>
							<th className="py-5 px-4 font-medium text-center">Subject line</th>
							<th className="py-5 px-4 font-medium text-center">Sent to</th>
							<th className="py-5 px-4 font-medium text-center">Status</th>
							<th className="py-5 px-4 font-medium">Last edited</th>
							<th className="py-5 px-4 font-medium text-center">Actions</th>
						</tr>
					</thead>
					<tbody>
						{isPlaceholderData && <TableRowsSkeleton cols={6} rows={8} />}
						{rows.map((email) => {
							const audience = audienceSummary(email.audience);
							const editedAt = email.updated_at ?? email.created_at;
							return (
								<tr
									key={email._id}
									className="border-b border-[#F1F5F9] last:border-b-0"
								>
									<td className="py-3 px-4">
										<Link
											href={broadcastHref(email)}
											className="block max-w-40 text-[13px] leading-5 font-semibold text-[#0F172A] hover:underline line-clamp-2"
										>
											{email.name}
										</Link>
									</td>
									<td className="py-3 px-4 text-[13px] text-[#334155] text-center">
										{email.subject || "—"}
									</td>
									<td className="py-3 px-4">
										<div
											className={`mx-auto min-w-24 w-fit px-3 whitespace-nowrap flex items-center justify-center gap-1.5 rounded-full py-1 text-[11px] ${audience.style}`}
										>
											<span className="h-1.5 w-1.5 rounded-full bg-white" />
											{audience.label}
										</div>
									</td>
									<td className="py-3 px-4">
										<div
											className={`mx-auto w-fit flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${STATUS_STYLES[email.status] ?? STATUS_STYLES.draft}`}
										>
											{email.status === "sent" && (
												<span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
											)}
											{email.status}
										</div>
									</td>
									<td className="py-3 px-4">
										<div className="flex flex-col">
											<span className="text-xs text-[#0F172A]">
												{editedAt ? handleHoursTime(editedAt) : "—"}
											</span>
											<span className="text-[11px] text-[#64748B]">
												{personName(email.created_by)}
											</span>
										</div>
									</td>
									<td className="py-3 px-4 text-center">
										<RowActions broadcast={email} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				{!isPlaceholderData && rows.length === 0 && (
					<div className="flex flex-col items-center gap-4 py-20">
						<span className="text-base font-normal text-foreground">
							{isError
								? "Couldn't load your emails. Try again shortly."
								: term
									? "No emails match your search"
									: "No emails here yet"}
						</span>
					</div>
				)}
			</div>

			<Pager
				page={data?.page ?? page}
				totalPages={data?.total_pages ?? 1}
				total={data?.total ?? 0}
				pageSize={PAGE_SIZE}
				shown={data?.data?.length ?? 0}
				noun="emails"
				onPage={setPage}
			/>
		</div>
	);
}
