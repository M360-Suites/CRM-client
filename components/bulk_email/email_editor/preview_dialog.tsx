"use client";

import { useMemo, useState } from "react";
import { Eye, Monitor, Smartphone } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { EmailDesign } from "@/types/bulk_email";
import { renderPreviewHtml } from "./render";

const WIDTHS = { desktop: "100%", mobile: "390px" };

// Shows exactly the HTML recipients get, at desktop or phone width
function PreviewWindow({
	design,
	subject,
	previewText,
	onClose,
}: {
	design: EmailDesign;
	subject: string;
	previewText?: string;
	onClose: () => void;
}) {
	const [device, setDevice] = useState<keyof typeof WIDTHS>("desktop");
	// Rendered once per open; the editor can't change while this is showing
	const html = useMemo(() => renderPreviewHtml(design), [design]);

	return (
		<Dialog open onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="sm:max-w-[960px] w-[calc(100vw-2rem)] p-0 gap-0 flex flex-col overflow-hidden rounded-2xl">
				<div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4">
					<div className="flex min-w-0 flex-col gap-1">
						<DialogTitle className="truncate text-base font-semibold text-[#0F172A]">
							{subject.trim() || "No subject yet"}
						</DialogTitle>
						<DialogDescription className="truncate text-xs italic text-[#64748B]">
							{previewText?.trim() || "No preview text"}
						</DialogDescription>
					</div>
					<div className="mr-8 flex shrink-0 rounded-md bg-[#F1F5F9] p-0.5">
						{(
							[
								["desktop", Monitor, "Desktop"],
								["mobile", Smartphone, "Mobile"],
							] as const
						).map(([key, Icon, label]) => (
							<button
								key={key}
								type="button"
								aria-pressed={device === key}
								onClick={() => setDevice(key)}
								className={`flex items-center gap-1.5 rounded-[5px] px-3 py-1 text-xs cursor-pointer ${
									device === key
										? "bg-white font-medium text-[#0F172A] shadow-sm"
										: "text-[#64748B] hover:text-[#0F172A]"
								}`}
							>
								<Icon size={14} />
								{label}
							</button>
						))}
					</div>
				</div>
				<div className="flex justify-center bg-[#E2E8F0] p-4">
					<iframe
						title="Email preview"
						srcDoc={html}
						sandbox=""
						className="h-[70vh] bg-white shadow-sm transition-[width] duration-200"
						style={{ width: WIDTHS[device], maxWidth: "100%" }}
					/>
				</div>
				<p className="border-t border-[#E2E8F0] px-5 py-2.5 text-[11px] text-[#64748B]">
					Merge tags like {"{{contact.first_name}}"} are filled in when the email
					is sent. Use &ldquo;Send me a test&rdquo; to see them with sample data.
				</p>
			</DialogContent>
		</Dialog>
	);
}

export default function PreviewButton({
	design,
	subject,
	previewText,
	className = "",
}: {
	design: EmailDesign;
	subject: string;
	previewText?: string;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className={`flex items-center gap-1.5 rounded-[4px] border border-[#E2E8F0] bg-white px-3 min-h-8 text-[13px] text-[#0F172A] hover:bg-gray-50 cursor-pointer ${className}`}
			>
				<Eye size={14} />
				Preview
			</button>
			{open && (
				<PreviewWindow
					design={design}
					subject={subject}
					previewText={previewText}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	);
}
