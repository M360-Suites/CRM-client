"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, PlusIcon, Search } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";
import { useEmailTemplates } from "@/hooks/bulk_email/templates";
import { useDebounced } from "@/hooks/bulk_email/use_debounced";
import Pager from "../pager";
import TemplateCard from "./template_card";
import { TemplateGridSkeleton } from "../skeletons";

const PAGE_SIZE = 24;

export default function TemplatesBody() {
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const term = useDebounced(search.trim());
	const { data, isLoading: firstLoad, isError, isPlaceholderData } = useEmailTemplates({
		search: term || undefined,
		page,
		limit: PAGE_SIZE,
	});
	// Skeletons also cover a new search or page while it loads
	const isLoading = firstLoad || isPlaceholderData;
	const visible = data?.data ?? [];

	return (
		<div className="w-full flex flex-col gap-6 pt-8 pb-8">
			<div className="flex max-md:flex-col max-md:items-start max-md:gap-4 items-center justify-between w-full">
				<div className="flex items-center gap-3">
					<Link
						href="/bulk-email"
						aria-label="Back to Bulk Email"
						className="p-1 rounded hover:bg-gray-100"
					>
						<ChevronLeft size={16} color="#94A3B8" />
					</Link>
					<h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium text-[#3A2418]">
						Email Templates
					</h2>
				</div>
				<CustomButton
					asChild
					variant="default"
					className="rounded-full flex flex-row items-center gap-2 md:px-5 max-md:px-4 py-2.5"
				>
					<Link href="/bulk-email/templates/new">
						<PlusIcon />
						<span>New email template</span>
					</Link>
				</CustomButton>
			</div>

			<div className="border border-[#D9E1E8] xl:w-xl md:w-sm w-full rounded-full text-[#3A2418] bg-[#F2F7FB] flex flex-row items-center gap-2 py-3 px-4">
				<Search color="#3A2418" size={20} />
				<input
					type="text"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setPage(1);
					}}
					placeholder="Search templates..."
					className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0"
				/>
			</div>

			{isLoading ? (
				<TemplateGridSkeleton />
			) : visible.length === 0 ? (
				<div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
					<span className="text-base font-normal text-foreground">
						{isError
							? "Couldn't load your templates. Try again shortly."
							: term
								? "No templates match your search"
								: "No templates yet"}
					</span>
				</div>
			) : (
				<div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7 max-w-[1100px]">
					{visible.map((template) => (
						<TemplateCard
							key={template._id}
							template={template}
							onSelect={() =>
								router.push(`/bulk-email/templates/${template._id}`)
							}
							onUse={() =>
								router.push(`/bulk-email/new?template=${template._id}`)
							}
						/>
					))}
				</div>
			)}

			<div className="max-w-[1100px]">
				<Pager
					page={data?.page ?? page}
					totalPages={data?.total_pages ?? 1}
					total={data?.total ?? 0}
					pageSize={PAGE_SIZE}
					shown={visible.length}
					noun="templates"
					onPage={setPage}
				/>
			</div>
		</div>
	);
}
