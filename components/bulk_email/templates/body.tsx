"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusIcon, Search } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import TemplateCard from "./template_card";

export default function TemplatesBody() {
	const router = useRouter();
	const { templates } = useBulkEmailStore();
	const [search, setSearch] = useState("");

	const term = search.trim().toLowerCase();
	const visible = templates.filter(
		(t) =>
			!term ||
			t.name.toLowerCase().includes(term) ||
			t.description.toLowerCase().includes(term),
	);

	return (
		<div className="w-full flex flex-col gap-6 pt-8 pb-8">
			<div className="flex max-md:flex-col max-md:items-start max-md:gap-4 items-center justify-between w-full">
				<h2 className="xl:text-2xl lg:text-xl/[110%] text-lg font-medium text-[#3A2418]">
					Email Templates
				</h2>
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
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search templates..."
					className="flex-1 placeholder:text-sm h-full outline-0 focus-visible:ring-0"
				/>
			</div>

			{visible.length === 0 ? (
				<div className="flex flex-col items-center gap-4 py-20 border border-[#E8E8E8] rounded-[12px]">
					<span className="text-base font-normal text-foreground">
						{term ? "No templates match your search" : "No templates yet"}
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
		</div>
	);
}
