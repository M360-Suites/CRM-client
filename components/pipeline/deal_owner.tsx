"use client";

import { useState } from "react";
import { ChevronDown, Loader } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useAssignDealOwner from "@/hooks/pipeline/assign_deal_owner";
import { useDealOwner } from "@/hooks/pipeline/get_deal_owners";
import { useCanManageDealAssignment } from "@/hooks/user/permissions";
import { getInitials } from "@/lib/utils";
import { Deal, PipelineTeamMembers } from "@/types/pipeline";
import OwnerOptions from "./owner_options";

export default function DealOwner({
	deal,
	teamMembers,
}: {
	deal: Deal;
	teamMembers: PipelineTeamMembers[];
}) {
	const [open, setOpen] = useState(false);
	const canManage = useCanManageDealAssignment();
	const owner = useDealOwner(deal.id);
	const { mutate: assignOwner, isPending } = useAssignDealOwner();

	return (
		<div className="flex flex-col gap-4">
			<span className="text-base font-medium text-foreground">Deal Owner</span>

			<div className="flex items-center gap-3">
				{owner ? (
					<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00B3A6] text-xs font-semibold text-white">
						{getInitials(owner.display_name)}
					</span>
				) : (
					<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-foreground/30 text-xs text-foreground/50">
						?
					</span>
				)}
				<div className="flex flex-col min-w-0">
					<span className="text-sm text-foreground">
						{owner?.display_name ?? "Unassigned"}
					</span>
					<span className="text-xs text-foreground/50 truncate">
						{owner ? owner.email : "No one owns this deal yet"}
					</span>
				</div>
			</div>

			{canManage && (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<button
							type="button"
							disabled={isPending}
							className="flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent pr-2 pl-2.5 text-sm cursor-pointer outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<span className="truncate">
								{owner?.display_name ?? "Unassigned"}
							</span>
							{isPending ? (
								<Loader size={16} className="animate-spin shrink-0" />
							) : (
								<ChevronDown
									size={16}
									className="shrink-0 text-muted-foreground"
								/>
							)}
						</button>
					</PopoverTrigger>
					<PopoverContent
						align="start"
						className="w-(--radix-popover-trigger-width) p-0 font-inter"
					>
						<OwnerOptions
							ownerId={owner?.id ?? null}
							members={teamMembers}
							disabled={isPending}
							onSelect={(ownerId) => {
								assignOwner({ deal_id: deal.id, owner_id: ownerId });
								setOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}
