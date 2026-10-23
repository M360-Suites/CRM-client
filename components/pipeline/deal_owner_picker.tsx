"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { useDealOwner } from "@/hooks/pipeline/get_deal_owners";
import useAssignDealOwner from "@/hooks/pipeline/assign_deal_owner";
import { useCanManageDealAssignment } from "@/hooks/user/permissions";
import { getInitials } from "@/lib/utils";
import OwnerOptions from "./owner_options";

function OwnerChip({ name }: { name?: string }) {
	return name ? (
		<span
			title={name}
			className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00B3A6] text-[10px] font-semibold text-white transition-colors group-hover:bg-[#009A8F]"
		>
			{getInitials(name)}
		</span>
	) : (
		<span
			title="Unassigned"
			className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-foreground/30 text-foreground/50 transition-colors group-hover:border-[#00B3A6] group-hover:text-[#00B3A6]"
		>
			<UserPlus size={12} />
		</span>
	);
}

export default function DealOwnerPicker({ dealId }: { dealId: string }) {
	const [open, setOpen] = useState(false);
	const owner = useDealOwner(dealId);
	const canManage = useCanManageDealAssignment();
	const { data: board } = useGetPipelineBoard();
	const { mutate: assignOwner, isPending } = useAssignDealOwner();

	if (!canManage) return <OwnerChip name={owner?.display_name} />;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="Assign deal"
					className="group inline-flex shrink-0 cursor-pointer rounded-full"
				>
					<OwnerChip name={owner?.display_name} />
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-64 p-0 font-inter">
				<OwnerOptions
					ownerId={owner?.id ?? null}
					members={board?.team_members ?? []}
					disabled={isPending}
					onSelect={(ownerId) => {
						assignOwner({ deal_id: dealId, owner_id: ownerId });
						setOpen(false);
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}
