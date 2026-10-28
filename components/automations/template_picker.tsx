"use client";

import { useState } from "react";
import { FolderOpen, Search, X } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import TemplateCard from "@/components/bulk_email/templates/template_card";

export interface PickerCategory {
	value: string;
	label: string;
	isNew?: boolean;
	heading?: string;
	description?: string;
}

export interface PickerItem {
	id: string;
	name: string;
	description: string;
	category: string;
	meta?: string;
}

// Large template browser used for workflow templates and for picking an
// email design inside a workflow.
export default function TemplatePicker({
	open,
	onOpenChange,
	title,
	categories,
	items,
	onUse,
	variant = "list",
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	categories: PickerCategory[];
	items: PickerItem[];
	onUse: (id: string) => void;
	// list: icon rows with counts, pills: rounded tabs with "New" badges
	variant?: "list" | "pills";
}) {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<string | null>(
		variant === "pills" ? categories[0]?.value ?? null : null,
	);

	const active = categories.find((c) => c.value === category);
	const term = search.trim().toLowerCase();
	const visible = items.filter(
		(i) =>
			(!category || i.category === category) &&
			(!term ||
				i.name.toLowerCase().includes(term) ||
				i.description.toLowerCase().includes(term)),
	);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-[1356px] w-[calc(100%-2rem)] h-[min(900px,calc(100vh-4rem))] p-0 gap-0 flex flex-col rounded-none ring-0"
			>
				<div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 md:px-12 py-7">
					<DialogTitle className="text-xl md:text-2xl font-semibold text-[#0F172A]">
						{title}
					</DialogTitle>
					<DialogClose
						aria-label="Close"
						className="p-1 rounded hover:bg-gray-100 cursor-pointer"
					>
						<X size={20} color="#0F172A" />
					</DialogClose>
				</div>

				<div className="flex max-md:flex-col flex-1 min-h-0 gap-8 px-6 md:px-16 pt-10">
					<div className="md:w-95 shrink-0 flex flex-col gap-10">
						<div className="flex items-center gap-3 rounded-full border border-[#D9E1E8] bg-[#F2F7FB] px-6 py-4">
							<Search size={20} color="#3A2418" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="search template"
								className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-[#334155]"
							/>
						</div>
						<div className="flex flex-col gap-4 max-md:hidden">
							<span className="text-lg text-[#0F172A]">Sort by category:</span>
							{variant === "list" ? (
								<div className="flex flex-col gap-1">
									{categories.map((c) => {
										const count = items.filter((i) => i.category === c.value).length;
										return (
											<button
												key={c.value}
												onClick={() =>
													setCategory((cur) => (cur === c.value ? null : c.value))
												}
												className={`flex items-center gap-5 rounded-lg px-5 py-4 text-left text-base cursor-pointer ${
													c.value === category
														? "bg-[#E6F2FF] text-[#0076D6]"
														: "text-[#334155] hover:bg-gray-50"
												}`}
											>
												<FolderOpen size={20} />
												{c.label} ({count})
											</button>
										);
									})}
								</div>
							) : (
								<div className="flex flex-col gap-1.5">
									{categories.map((c) => (
										<button
											key={c.value}
											onClick={() => setCategory(c.value)}
											className={`flex items-center justify-between rounded-full px-3 py-1.5 text-xs cursor-pointer ${
												c.value === category
													? "bg-[#F1F5F9] text-[#0F172A]"
													: "text-[#334155] hover:bg-gray-50"
											}`}
										>
											{c.label}
											{c.isNew && (
												<span className="rounded-full bg-[#ECFDF5] px-1.5 py-0.5 text-[9px] text-[#059669]">
													New
												</span>
											)}
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					<div className="flex-1 min-w-0 overflow-y-auto pb-10">
						{active?.heading && (
							<div className="flex flex-col gap-2 pb-6">
								<h3 className="text-base text-[#0F172A]">{active.heading}</h3>
								<p className="text-xs leading-5 text-[#334155] max-w-lg">
									{active.description}
								</p>
							</div>
						)}
						{visible.length === 0 ? (
							<p className="py-20 text-center text-sm text-[#64748B]">
								No templates match your search
							</p>
						) : (
							<div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7">
								{visible.map((item) => (
									<TemplateCard
										key={item.id}
										template={item}
										meta={item.meta}
										onSelect={() => onUse(item.id)}
										onUse={() => onUse(item.id)}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
