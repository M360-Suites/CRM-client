"use client";

import { CustomPopover } from "@/components/custom/common/customPopover";
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import { EmailContent } from "@/types/bulk_email";

// "Template" block of an editor's side panel: current design plus browse/save.
export default function TemplateSection({
	templateName,
	onApply,
	onSave,
}: {
	templateName: string;
	onApply: (content: EmailContent, templateId: string) => void;
	onSave: () => void;
}) {
	const { templates } = useBulkEmailStore();

	return (
		<div className="flex flex-col gap-2">
			<span className="flex items-center gap-1.5 text-xs text-[#334155]">
				Template
				<span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
			</span>
			<div className="flex gap-3 rounded-md border border-[#E2E8F0] p-2.5">
				<div className="w-11 h-14 shrink-0 rounded-[3px] border border-[#E2E8F0] bg-white flex flex-col gap-1 p-1.5">
					<span className="h-3 w-full rounded-[1px] bg-[#BAE6FD]" />
					<span className="h-0.5 w-3/4 rounded-full bg-[#E2E8F0]" />
					<span className="h-0.5 w-full rounded-full bg-[#E2E8F0]" />
					<span className="mt-0.5 h-1 w-1/2 rounded-full bg-[#14B8A6]" />
				</div>
				<div className="flex flex-col gap-1.5 flex-1 min-w-0">
					<span className="text-xs font-semibold text-[#0F172A] truncate">
						{templateName}
					</span>
					<CustomPopover
						align="start"
						title="Templates"
						popoverClassname="max-h-72 overflow-y-auto"
						className="pt-2 flex flex-col w-56"
						trigger={
							<button className="rounded-[4px] border border-[#E2E8F0] py-1 text-[11px] text-[#334155] hover:bg-gray-50 cursor-pointer">
								Browse templates
							</button>
						}
					>
						{templates.length === 0 && (
							<span className="px-2 py-1.5 text-xs text-[#64748B]">
								No saved templates yet
							</span>
						)}
						{templates.map((t) => (
							<button
								key={t._id}
								onClick={() =>
									onApply(structuredClone(t.content), t._id)
								}
								className="text-left px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-gray-100 cursor-pointer"
							>
								{t.name}
							</button>
						))}
					</CustomPopover>
					<button
						onClick={onSave}
						className="rounded-[4px] border border-[#E2E8F0] py-1 text-[11px] text-[#334155] hover:bg-gray-50 cursor-pointer"
					>
						Save template
					</button>
				</div>
			</div>
		</div>
	);
}
