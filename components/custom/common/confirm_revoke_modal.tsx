"use client";

import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "@/components/ui/dialog";
import { CustomButton } from "./customButton";

interface ConfirmRevokeModalProps {
	trigger: React.ReactNode;
	title: string;
	description: React.ReactNode;
	confirmationText: string;
	confirmLabel: string;
	pendingLabel: string;
	isPending: boolean;
	onConfirm: (close: () => void) => void;
}

export function ConfirmRevokeModal({
	trigger,
	title,
	description,
	confirmationText,
	confirmLabel,
	pendingLabel,
	isPending,
	onConfirm,
}: ConfirmRevokeModalProps) {
	const [open, setOpen] = useState(false);
	const [typed, setTyped] = useState("");
	const canConfirm = typed === confirmationText;

	function handleOpenChange(next: boolean) {
		setOpen(next);
		if (!next) setTyped("");
	}

	function handleConfirm() {
		if (!canConfirm || isPending) return;
		onConfirm(() => handleOpenChange(false));
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent showCloseButton={false} className="p-0 gap-0 sm:max-w-md">
				<DialogHeader label={title} />
				<div className="flex flex-col gap-4 px-5 py-4">
					<DialogDescription className="text-foreground/80">
						{description}
					</DialogDescription>
					<label className="flex flex-col gap-1.5 text-sm">
						<span className="text-muted-foreground">
							Type{" "}
							<span className="font-mono font-semibold text-foreground">
								{confirmationText}
							</span>{" "}
							to confirm
						</span>
						<input
							value={typed}
							onChange={(e) => setTyped(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleConfirm();
							}}
							autoComplete="off"
							spellCheck={false}
							placeholder={confirmationText}
							className="w-full rounded-md border px-3 py-1.5 text-sm"
						/>
					</label>
				</div>
				<DialogFooter className="m-0">
					<DialogClose asChild>
						<CustomButton variant="outline" className="text-xs">
							Cancel
						</CustomButton>
					</DialogClose>
					<CustomButton
						variant="destructive"
						onClick={handleConfirm}
						disabled={!canConfirm || isPending}
						className="text-xs"
					>
						{isPending ? pendingLabel : confirmLabel}
					</CustomButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
