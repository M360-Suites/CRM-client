import { useDraggable } from "@dnd-kit/react";
import { MoreVertical, Pencil, Loader, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { ActionMenu } from "../custom/common/action_menu";
import { CustomDrawer } from "../custom/common/drawer";
import { useDeleteDeal } from "@/hooks/pipeline/delete_deal";
import AddDealForm from "./form/add_deal";
import DealDetail from "./deal_detail";
import { Deal } from "@/types/pipeline";
import DealOwnerPicker from "./deal_owner_picker";

export function Draggable({ lead }: { lead: Deal }) {
	const { mutate: deleteDeal, isPending: isDeleting } = useDeleteDeal();
	const [panel, setPanel] = useState<"view" | "edit" | null>(null);
	const { ref, isDragging } = useDraggable({
		id: lead.id,
		type: "card",
		data: { lead },
	});

	return (
		<div
			ref={ref}
			style={{ transition: isDragging ? "none" : undefined }}
			className={`bg-[#F2F7FB] border border-[#D9E1E8] rounded-[10px] px-3 py-4 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing w-full ${
				isDragging ? "opacity-40" : "opacity-100"
			}`}
		>
			<div className="flex items-start justify-between gap-2 w-full">
				<span className="text-sm font-medium text-[#334155] min-w-0 flex-1 truncate">
					{lead.title}
				</span>
				<div className="flex shrink-0 items-center gap-1.5">
					<DealOwnerPicker dealId={lead.id} />
					<ActionMenu
						title={lead.title}
						trigger={
							<button
								type="button"
								aria-label="Deal actions"
								className="rounded-md p-0.5 text-black/60 hover:bg-black/5 hover:text-black cursor-pointer"
							>
								{isDeleting ? (
									<Loader size={16} className="animate-spin" />
								) : (
									<MoreVertical size={16} />
								)}
							</button>
						}
						items={[
							{
								label: "View details",
								icon: Eye,
								onSelect: () => setPanel("view"),
							},
							{
								label: "Edit deal",
								icon: Pencil,
								onSelect: () => setPanel("edit"),
							},
							{
								label: "Delete deal",
								icon: Trash2,
								destructive: true,
								onSelect: () => deleteDeal(lead.id),
								confirm: {
									title: "Delete this deal",
									description:
										"It will be removed from the pipeline for everyone.",
									confirmLabel: "Delete",
								},
							},
						]}
					/>
				</div>
			</div>
			{lead.industry && (
				<span className="text-xs text-black/50">{lead.industry}</span>
			)}

			<span className="text-xs font-medium text-black truncate">
				₦{(lead.value ?? 0).toLocaleString()}
			</span>

			{/* Drawers live outside the menu so closing the menu doesn't unmount them */}
			<CustomDrawer
				label="Deal Details"
				open={panel === "view"}
				onOpenChange={(open) => !open && setPanel(null)}
			>
				<DealDetail deal={lead} />
			</CustomDrawer>
			<CustomDrawer
				label="Edit Deal"
				open={panel === "edit"}
				onOpenChange={(open) => !open && setPanel(null)}
			>
				{(close) => (
					<AddDealForm editMode={true} deal={lead} onSuccess={close} />
				)}
			</CustomDrawer>
		</div>
	);
}
