"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export type ActionMenuItem = {
	label: string;
	icon: LucideIcon;
	onSelect: () => void;
	destructive?: boolean;
	// Ask inside the menu before running a destructive action
	confirm?: { title: string; description?: string; confirmLabel: string };
};

// Compact "⋮" menu: closes on pick, destructive items confirm in place
export function ActionMenu({
	trigger,
	title,
	items,
	align = "end",
}: {
	trigger: React.ReactNode;
	title?: string;
	items: ActionMenuItem[];
	align?: "start" | "center" | "end";
}) {
	const [open, setOpen] = useState(false);
	const [confirming, setConfirming] = useState<ActionMenuItem | null>(null);

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next) setConfirming(null);
	};

	const run = (item: ActionMenuItem) => {
		handleOpenChange(false);
		item.onSelect();
	};

	const regular = items.filter((item) => !item.destructive);
	const destructive = items.filter((item) => item.destructive);

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent
				align={align}
				// Keep pointer events off any draggable parent
				onPointerDown={(e) => e.stopPropagation()}
				className="w-48 p-1 font-inter"
			>
				{confirming?.confirm ? (
					<div className="flex flex-col gap-2 p-2">
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-medium text-foreground">
								{confirming.confirm.title}
							</span>
							{confirming.confirm.description && (
								<span className="text-xs text-foreground/60">
									{confirming.confirm.description}
								</span>
							)}
						</div>
						<div className="flex items-center justify-end gap-1.5">
							<button
								type="button"
								onClick={() => setConfirming(null)}
								className="rounded-md px-2.5 py-1.5 text-xs font-medium text-foreground/70 hover:bg-gray-100 cursor-pointer"
							>
								Cancel
							</button>
							<button
								type="button"
								autoFocus
								onClick={() => run(confirming)}
								className="rounded-md bg-[#FB3748] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#E02D3D] cursor-pointer"
							>
								{confirming.confirm.confirmLabel}
							</button>
						</div>
					</div>
				) : (
					<div className="flex flex-col">
						{title && (
							<span className="truncate px-2 pt-1.5 pb-1 text-[11px] font-medium text-foreground/50">
								{title}
							</span>
						)}
						{regular.map((item) => (
							<MenuButton
								key={item.label}
								item={item}
								onClick={() => run(item)}
							/>
						))}
						{destructive.length > 0 && regular.length > 0 && (
							<div className="my-1 h-px bg-[#E2E8F0]" />
						)}
						{destructive.map((item) => (
							<MenuButton
								key={item.label}
								item={item}
								onClick={() => (item.confirm ? setConfirming(item) : run(item))}
							/>
						))}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}

function MenuButton({
	item,
	onClick,
}: {
	item: ActionMenuItem;
	onClick: () => void;
}) {
	const Icon = item.icon;
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm cursor-pointer transition-colors ${
				item.destructive
					? "text-[#FB3748] hover:bg-[#FB3748]/10"
					: "text-foreground hover:bg-gray-100"
			}`}
		>
			<Icon
				size={14}
				className={item.destructive ? "text-[#FB3748]" : "text-foreground/60"}
			/>
			{item.label}
		</button>
	);
}
