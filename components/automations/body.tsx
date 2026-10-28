"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Check,
	ChevronLeft,
	ChevronRight,
	Copy,
	Ellipsis,
	LayoutGrid,
	Pencil,
	Plus,
	Search,
	Trash2,
	Workflow,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { useAutomationStore } from "@/stores/automation/automation_store";
import { Automation, AutomationStatus } from "@/types/automation";
import { createAutomation, triggerLabel, WORKFLOW_TEMPLATES, countEmails } from "./data";
import TemplatePicker from "./template_picker";

const TABS: { label: string; value: AutomationStatus | "all" }[] = [
	{ label: "All", value: "all" },
	{ label: "Drafts", value: "draft" },
	{ label: "Scheduled", value: "scheduled" },
	{ label: "Published", value: "published" },
];

const STATUS_STYLES: Record<AutomationStatus, string> = {
	draft: "bg-[#FEF3C7] text-[#F59E0B]",
	scheduled: "bg-[#E6F2FF] text-[#0076D6]",
	published: "bg-[#DFF8EF] text-[#00A16E]",
};

const PAGE_SIZE = 10;

const WORKFLOW_CATEGORIES = [...new Set(WORKFLOW_TEMPLATES.map((t) => t.category))].map(
	(c) => ({ value: c, label: c }),
);

const WORKFLOW_ITEMS = WORKFLOW_TEMPLATES.map((t) => ({
	id: t._id,
	name: t.name,
	description: t.description,
	category: t.category,
	meta: `Email (${countEmails(t.build().steps)})`,
}));

function useCreateFromTemplate() {
	const router = useRouter();
	const { saveAutomation } = useAutomationStore();
	return (templateId?: string) => {
		const template = WORKFLOW_TEMPLATES.find((t) => t._id === templateId);
		const automation = createAutomation(template?.build());
		saveAutomation(automation);
		router.push(`/automations/${automation._id}`);
	};
}

function EmptyState({ onBrowse }: { onBrowse: () => void }) {
	const create = useCreateFromTemplate();
	return (
		<div className="flex max-lg:flex-col items-center gap-10 rounded-lg border border-[#D9E1E8] bg-white p-8 lg:pl-12">
			<div className="flex flex-col flex-1">
				<h3 className="text-2xl xl:text-[28px] font-semibold text-[#0F172A]">
					Create your automation workflow
				</h3>
				<p className="mt-1 text-base text-[#0F172A]">
					Make emails and texts work while you&apos;re off the clock!
				</p>
				<ul className="mt-9 flex flex-col gap-4 text-base text-[#0F172A]">
					{["Automated emails & texts", "Premade workflows", "Advanced triggers"].map(
						(item) => (
							<li key={item} className="flex items-center gap-2">
								<Check size={16} color="#00A16E" />
								{item}
							</li>
						),
					)}
				</ul>
				<div className="mt-14 flex flex-wrap items-center gap-3">
					<CustomButton
						onClick={onBrowse}
						className="rounded-full border-0 px-8 h-14 text-sm"
					>
						Create with template
					</CustomButton>
					<button
						onClick={() => create()}
						className="px-3 py-2 text-base font-medium text-[#0F172A] hover:underline cursor-pointer"
					>
						Create from scratch
					</button>
				</div>
			</div>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src="/assets/automation-hero.webp"
				alt="Leads moving through a sales funnel"
				className="w-full max-w-md aspect-square rounded-[28px] object-cover"
			/>
		</div>
	);
}

function RowActions({ automation }: { automation: Automation }) {
	const { saveAutomation, deleteAutomation } = useAutomationStore();
	const item =
		"flex items-center justify-center gap-2 px-4 py-3 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer border-b border-[#E8E8E8] last:border-b-0";

	return (
		<CustomPopover
			align="center"
			className="!p-0 flex flex-col w-38"
			trigger={
				<button
					aria-label="Automation actions"
					className="h-10 w-10 flex items-center justify-center rounded-lg border border-[#4A4A4A]/70 hover:bg-gray-50 cursor-pointer"
				>
					<Ellipsis size={16} color="#0F172A" />
				</button>
			}
		>
			<button
				className={item}
				onClick={() => {
					const name = window.prompt("Rename automation", automation.name);
					if (name?.trim())
						saveAutomation({ ...automation, name: name.trim() });
				}}
			>
				<Pencil size={14} />
				Rename
			</button>
			<button
				className={item}
				onClick={() => {
					saveAutomation({
						...structuredClone(automation),
						_id: crypto.randomUUID(),
						name: `${automation.name} (copy)`,
						status: "draft",
						active: false,
						updated_at: new Date().toISOString(),
					});
					toast.success("Automation duplicated");
				}}
			>
				<Copy size={14} />
				Duplicate
			</button>
			<button
				className={`${item} text-[#DC2626]`}
				onClick={() => {
					// TODO: call the delete endpoint once the backend adds one
					deleteAutomation(automation._id);
					toast.success("Automation deleted");
				}}
			>
				<Trash2 size={14} color="#DC2626" />
				Delete
			</button>
		</CustomPopover>
	);
}

function ActiveToggle({ automation }: { automation: Automation }) {
	const { saveAutomation } = useAutomationStore();
	return (
		<button
			type="button"
			role="switch"
			aria-checked={automation.active}
			aria-label={automation.active ? "Pause automation" : "Activate automation"}
			onClick={() =>
				saveAutomation({ ...automation, active: !automation.active })
			}
			className={`relative h-5.5 w-9 shrink-0 rounded-full transition-colors cursor-pointer ${
				automation.active ? "bg-[#0091FE]" : "bg-[#E2E8F0]"
			}`}
		>
			<span
				className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-all ${
					automation.active ? "left-4" : "left-0.5"
				}`}
			/>
		</button>
	);
}

export default function Body() {
	const { automations } = useAutomationStore();
	const create = useCreateFromTemplate();
	const [browsing, setBrowsing] = useState(false);
	const [activeTab, setActiveTab] = useState<AutomationStatus | "all">("all");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		return automations.filter(
			(a) =>
				(activeTab === "all" || a.status === activeTab) &&
				(!term ||
					[a.name, triggerLabel(a.trigger), a.trigger.group].some((v) =>
						v.toLowerCase().includes(term),
					)),
		);
	}, [automations, activeTab, search]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;
	const rows = filtered.slice(start, start + PAGE_SIZE);
	const empty = automations.length === 0;

	return (
		<div className="w-full flex flex-col gap-8 pt-8 pb-8">
			<div className="flex max-md:flex-col max-md:items-start max-md:gap-4 items-center justify-between w-full">
				<h2 className="xl:text-[28px] lg:text-xl/[110%] text-lg font-normal text-[#0F172A]">
					Automations
				</h2>
				{!empty && (
					<div className="flex items-center md:gap-4 gap-2">
						<CustomButton
							variant="ghost"
							onClick={() => setBrowsing(true)}
							className="rounded-full flex items-center gap-2 md:px-6 max-md:px-4 h-12 md:h-14 text-sm"
						>
							<LayoutGrid />
							Templates
						</CustomButton>
						<CustomButton
							onClick={() => create()}
							className="rounded-full border-0 flex items-center gap-2 md:px-7 max-md:px-4 h-12 md:h-14 text-sm"
						>
							<Plus />
							Create new automation
						</CustomButton>
					</div>
				)}
			</div>

			{empty ? (
				<EmptyState onBrowse={() => setBrowsing(true)} />
			) : (
				<>
					<div className="flex max-lg:flex-col max-lg:gap-3 max-lg:items-start items-center justify-between w-full">
						<div className="border border-[#D9E1E8] xl:w-[633px] md:w-sm w-full rounded-full bg-white flex flex-row items-center gap-3 py-3 px-6">
							<Search color="#3A2418" size={20} />
							<input
								type="text"
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								placeholder="Search automations or triggers..."
								className="flex-1 min-w-0 placeholder:text-[#64748B] outline-0"
							/>
						</div>
						<div className="flex flex-row items-center gap-1 overflow-x-auto max-w-full">
							{TABS.map((tab) => (
								<button
									key={tab.value}
									className={`rounded-full min-w-25 px-4 h-11.5 cursor-pointer text-base ${
										tab.value === activeTab
											? "bg-[#0091FE] text-white"
											: "bg-white text-[#334155] border border-[#D9E1E8] hover:bg-gray-50"
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
						<div className="min-w-[960px] flex flex-col gap-2">
							<div className="grid grid-cols-[3fr_2.5fr_2fr_1.5fr] items-center rounded-lg bg-white h-15 px-5 text-[11px] font-semibold tracking-wider text-[#334155]">
								<span className="text-center">AUTOMATION</span>
								<span className="text-center">TRIGGER</span>
								<span className="text-center">STAT</span>
								<span className="text-center">ACTIONS</span>
							</div>

							{rows.map((a) => (
								<div
									key={a._id}
									className="grid grid-cols-[3fr_2.5fr_2fr_1.5fr] items-center bg-white px-5 py-4"
								>
									<Link
										href={`/automations/${a._id}`}
										className="flex items-center gap-3 min-w-0 group"
									>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src="/assets/bulk-email-hero.jpg"
											alt=""
											className="h-15 w-16 shrink-0 object-cover"
										/>
										<div className="flex flex-col gap-3 min-w-0">
											<span className="text-[11px] font-semibold text-[#4A4A4A] truncate group-hover:underline">
												{a.name}
											</span>
											<div className="flex items-center gap-3">
												<span
													className={`rounded-full px-3 py-1 text-[10.5px] font-semibold capitalize ${STATUS_STYLES[a.status]}`}
												>
													{a.status}
												</span>
												<span className="text-[10.5px] text-[#4A4A4A] truncate">
													Last edited:{" "}
													{moment(a.updated_at).format("MMM D, YYYY h:mm A")}
												</span>
											</div>
										</div>
									</Link>

									<div className="flex items-center gap-3 justify-center min-w-0">
										<Workflow size={18} color="#0091FE" className="shrink-0" />
										<div className="flex flex-col gap-1 min-w-0">
											<span className="text-[11px] font-semibold text-[#4A4A4A] truncate">
												{triggerLabel(a.trigger)}
											</span>
											<span className="text-[10.5px] text-[#4A4A4A] truncate">
												From: {a.trigger.group}
											</span>
										</div>
									</div>

									<div className="flex items-center justify-center gap-6 text-center">
										{[
											{ value: `${a.stats.clicks}%`, label: "Clicks", color: "#AF2661" },
											{ value: a.stats.sent, label: "Email sent", color: "#0076D6" },
											{ value: `${a.stats.opens}%`, label: "Opens", color: "#22C55E" },
										].map((s) => (
											<div key={s.label} className="flex flex-col gap-3">
												<span className="text-xs font-semibold" style={{ color: s.color }}>
													{s.value}
												</span>
												<span className="text-[10.5px] text-[#4A4A4A]">{s.label}</span>
											</div>
										))}
									</div>

									<div className="flex items-center justify-center gap-6">
										<RowActions automation={a} />
										<ActiveToggle automation={a} />
									</div>
								</div>
							))}

							{rows.length === 0 && (
								<div className="flex flex-col items-center gap-4 py-20 bg-white">
									<span className="text-base text-foreground">
										{search.trim()
											? "No automations match your search"
											: "No automations here yet"}
									</span>
								</div>
							)}

							{filtered.length > 0 && (
								<div className="flex items-center justify-between bg-white h-12 px-5">
									<span className="text-[10.5px] text-[#4A4A4A]">
										Showing {rows.length} of {filtered.length} automation
										{filtered.length === 1 ? "" : "s"}
									</span>
									<div className="flex items-center gap-2">
										<button
											aria-label="Previous page"
											onClick={() => setPage(currentPage - 1)}
											disabled={currentPage <= 1}
											className="h-7 w-7 flex items-center justify-center rounded-[7px] border border-[#E8E8E8] text-[#4A4A4A] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
										>
											<ChevronLeft size={14} />
										</button>
										{Array.from({ length: totalPages }).map((_, i) => (
											<button
												key={i}
												onClick={() => setPage(i + 1)}
												className={`h-7 min-w-7 px-1 rounded-[7px] text-xs font-semibold cursor-pointer ${
													currentPage === i + 1
														? "bg-[#0091FE] text-white"
														: "border border-[#E8E8E8] text-[#4A4A4A]"
												}`}
											>
												{i + 1}
											</button>
										))}
										<button
											aria-label="Next page"
											onClick={() => setPage(currentPage + 1)}
											disabled={currentPage >= totalPages}
											className="h-7 w-7 flex items-center justify-center rounded-[7px] border border-[#E8E8E8] text-[#4A4A4A] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
										>
											<ChevronRight size={14} />
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</>
			)}

			<TemplatePicker
				open={browsing}
				onOpenChange={setBrowsing}
				title="Browse workflow Templates"
				categories={WORKFLOW_CATEGORIES}
				items={WORKFLOW_ITEMS}
				onUse={(id) => {
					setBrowsing(false);
					create(id);
				}}
			/>
		</div>
	);
}
