"use client";

import { EmailTemplate } from "@/types/bulk_email";

export default function TemplateCard({
	template,
	onSelect,
	onUse,
}: {
	template: EmailTemplate;
	onSelect: () => void;
	onUse?: () => void;
}) {
	return (
		<div
			role="button"
			tabIndex={0}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect();
				}
			}}
			className="group flex flex-col bg-white border border-[#E2E8F0] aspect-[25/28] cursor-pointer overflow-hidden hover:border-[#0091FE] hover:shadow-sm transition-all"
		>
			<div className="h-[38%] min-h-24 bg-[#F8FAFC]" />
			<div
				className={`flex flex-col flex-1 px-4 pt-3 ${onUse ? "pb-4" : "justify-end pb-6"}`}
			>
				<span className="text-[13px] font-medium text-[#0F172A]">
					{template.name}
				</span>
				<p className="text-[11px] text-[#334155] line-clamp-4">
					{template.description}
				</p>
				{onUse && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onUse();
						}}
						className="mt-auto w-fit rounded-md bg-[#E6F2FF] px-3 py-1 text-[11px] text-[#0091FE] hover:bg-[#D5E9FF] cursor-pointer"
					>
						Use Template
					</button>
				)}
			</div>
		</div>
	);
}
