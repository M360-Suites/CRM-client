"use client";

import { EmailTemplate } from "@/types/bulk_email";

// A scaled-down sketch of the email layout, standing in for a rendered preview.
function TemplateThumbnail({ template }: { template: EmailTemplate }) {
	const { content } = template;
	return (
		<div
			className="h-[38%] min-h-24 flex justify-center pt-3 overflow-hidden"
			style={{ backgroundColor: `#${content.background_color}1A` }}
		>
			<div className="w-1/2 bg-white rounded-t-sm shadow-sm flex flex-col gap-1.5 p-2">
				<div
					className="h-6 rounded-[2px] bg-cover bg-center bg-[#E2E8F0]"
					style={
						content.image.url
							? { backgroundImage: `url(${content.image.url})` }
							: undefined
					}
				/>
				<div className="h-1 w-4/5 rounded-full bg-[#E2E8F0]" />
				<div className="h-1 w-full rounded-full bg-[#E2E8F0]" />
				<div
					className="h-1.5 w-1/3 rounded-full"
					style={{ backgroundColor: `#${content.button_background_color}` }}
				/>
			</div>
		</div>
	);
}

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
			<TemplateThumbnail template={template} />
			<div className="flex flex-col flex-1 px-4 pt-3 pb-4">
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
