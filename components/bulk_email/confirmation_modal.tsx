"use client";

import { Check } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/custom/common/customButton";

export default function ConfirmationModal({
	open,
	title,
	description,
	actionLabel,
	onAction,
}: {
	open: boolean;
	title: string;
	description: string;
	actionLabel: string;
	onAction: () => void;
}) {
	return (
		<Dialog open={open} onOpenChange={(o) => !o && onAction()}>
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-[390px] p-7 gap-0 flex flex-col items-start text-left rounded-2xl ring-0 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
			>
				<div className="h-10 w-10 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] flex items-center justify-center">
					<Check size={20} color="#10B981" strokeWidth={2} />
				</div>
				<DialogTitle className="mt-5 text-lg font-normal text-[#334155]">
					{title}
				</DialogTitle>
				<DialogDescription className="mt-2 text-[13px] leading-5 text-[#64748B]">
					{description}
				</DialogDescription>
				<CustomButton
					onClick={onAction}
					className="mt-6 w-full rounded-lg border-0 min-h-10 text-[13px] font-normal"
				>
					{actionLabel}
				</CustomButton>
			</DialogContent>
		</Dialog>
	);
}
