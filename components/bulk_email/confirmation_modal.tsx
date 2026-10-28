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
				className="sm:max-w-[390px] p-7 gap-0 flex flex-col items-center text-center rounded-2xl"
			>
				<div className="h-10 w-10 rounded-full bg-[#D1FAE5] flex items-center justify-center">
					<Check size={20} color="#059669" strokeWidth={2.5} />
				</div>
				<DialogTitle className="mt-5 text-xl font-medium text-[#0F172A]">
					{title}
				</DialogTitle>
				<DialogDescription className="mt-2 text-sm text-[#64748B]">
					{description}
				</DialogDescription>
				<CustomButton
					onClick={onAction}
					className="mt-6 w-full py-2.5 text-sm"
				>
					{actionLabel}
				</CustomButton>
			</DialogContent>
		</Dialog>
	);
}
