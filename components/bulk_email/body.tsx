"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ChevronLeft,
	ChevronRight,
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
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import { handleHoursTime } from "@/lib/utils";
import { BulkEmailStatus } from "@/types/bulk_email";
import { AUDIENCE_LABELS, AUDIENCE_STYLES, STATUS_STYLES } from "./data";

const TABS: { label: string; value: BulkEmailStatus | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Drafts", value: "draft" },
	{ label: "Scheduled", value: "scheduled" },
	{ label: "Published", value: "published" },
];

const PAGE_SIZE = 10;

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

function RowActions({ id }: { id: string }) {
	const router = useRouter();
	const { deleteEmail } = useBulkEmailStore();

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
			className="pt-2 flex flex-col w-28"
			popoverClassname="bg-[#F7FAFC]"
		>
			<button
				onClick={() => router.push(`/bulk-email/new?id=${id}`)}
				className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#334155] hover:bg-gray-100 cursor-pointer"
			>
				<Pencil size={14} />
				Edit
			</button>
			<button
				onClick={() => {
					// TODO: call the delete endpoint once the backend adds one
					deleteEmail(id);
					toast.success("Email deleted");
				}}
				className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#DC2626] hover:bg-red-50 cursor-pointer"
			>
				<Trash2 size={14} />
				Delete
			</button>
		</CustomPopover>
	);
}

export default function Body() {
	const { emails } = useBulkEmailStore();
	const [activeTab, setActiveTab] = useState<BulkEmailStatus | "all">("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		return emails.filter(
			(e) =>
				(activeTab === "all" || e.status === activeTab) &&
				(!term ||
					[e.title, e.subject, e.updated_by].some((v) =>
						v.toLowerCase().includes(term),
					)),
		);
	}, [emails, activeTab, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;
	const rows = filtered.slice(start, start + PAGE_SIZE);

	if (emails.length === 0) return <EmptyState />;

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
						placeholder="Search email drafts, subject lines, or authors..."
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
						{rows.map((email) => (
							<tr
								key={email._id}
								className="border-b border-[#F1F5F9] last:border-b-0"
							>
								<td className="py-3 px-4">
									<Link
										href={`/bulk-email/new?id=${email._id}`}
										className="block max-w-40 text-[13px] leading-5 font-semibold text-[#0F172A] hover:underline line-clamp-2"
									>
										{email.title}
									</Link>
								</td>
								<td className="py-3 px-4 text-[13px] text-[#334155] text-center">
									{email.subject}
								</td>
								<td className="py-3 px-4">
									<div
										className={`mx-auto w-24 flex items-center justify-center gap-1.5 rounded-full py-1 text-[11px] ${AUDIENCE_STYLES[email.audience]}`}
									>
										<span className="h-1.5 w-1.5 rounded-full bg-white" />
										{AUDIENCE_LABELS[email.audience]}
									</div>
								</td>
								<td className="py-3 px-4">
									<div
										className={`mx-auto w-fit flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase ${STATUS_STYLES[email.status]}`}
									>
										{email.status === "published" && (
											<span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
										)}
										{email.status}
									</div>
								</td>
								<td className="py-3 px-4">
									<div className="flex flex-col">
										<span className="text-xs text-[#0F172A]">
											{handleHoursTime(email.updated_at)}
										</span>
										<span className="text-[11px] text-[#64748B]">
											{email.updated_by}
										</span>
									</div>
								</td>
								<td className="py-3 px-4 text-center">
									<RowActions id={email._id} />
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{rows.length === 0 && (
					<div className="flex flex-col items-center gap-4 py-20">
						<span className="text-base font-normal text-foreground">
							{search.trim()
								? "No emails match your search"
								: "No emails here yet"}
						</span>
					</div>
				)}
			</div>

			{filtered.length > 0 && (
				<div className="flex items-center justify-between gap-4 w-full">
					<span className="text-xs text-[#334155]">
						Showing {start + 1}-{start + rows.length} of{" "}
						{filtered.length} emails
					</span>
					<div className="flex items-center gap-2">
						<button
							aria-label="Previous page"
							onClick={() => setPage(currentPage - 1)}
							disabled={currentPage <= 1}
							className="p-1 text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
						>
							<ChevronLeft size={16} />
						</button>
						{Array.from({ length: totalPages }).map((_, i) => (
							<button
								key={i}
								onClick={() => setPage(i + 1)}
								className={`h-6 min-w-6 px-1 rounded text-xs cursor-pointer ${
									currentPage === i + 1
										? "border border-[#0091FE] text-[#0091FE]"
										: "text-[#334155] hover:bg-gray-100"
								}`}
							>
								{i + 1}
							</button>
						))}
						<button
							aria-label="Next page"
							onClick={() => setPage(currentPage + 1)}
							disabled={currentPage >= totalPages}
							className="p-1 text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
						>
							<ChevronRight size={16} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
