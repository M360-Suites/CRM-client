import { useDraggable } from "@dnd-kit/react";
import { MoreVertical, Pencil, Loader, Trash2 } from "lucide-react";
import { CustomPopover } from "../custom/common/customPopover";
import { CustomDrawer } from "../custom/common/drawer";
import { useDeleteDeal } from "@/hooks/pipeline/delete_deal";
import AddDealForm from "./form/add_deal";
import { Deal } from "@/types/pipeline";

export function Draggable({ lead }: { lead: Deal }) {
  const { mutate: deleteDeal, isPending: isDeleting } = useDeleteDeal();
  const { ref, isDragging } = useDraggable({
    id: lead.id,
    type: "card",
    data: { lead },
  });

  return (
    <div
      ref={ref}
      style={{ transition: isDragging ? "none" : undefined }}
      className={`bg-[#4a0f0a] border rounded-[10px] p-3 flex flex-col gap-1.5 cursor-grab active:cursor-grabbing w-full ${
        isDragging ? "hidden" : "opacity-100"
      }`}
    >
      <div className="flex items-start justify-between w-full">
        <span className="text-sm font-medium text-white max-w-[85%] truncate">
          {lead.title}
        </span>
        <CustomPopover
          trigger={
            <MoreVertical
              size={16}
              className="text-white/80 hover:cursor-pointer"
            />
          }
        >
          <div className="flex flex-col w-24 max-md:w-22 pt-2">
            <CustomDrawer
              trigger={
                <button className="flex items-center gap-2.5 px-1.5 py-2 text-foreground transition-colors cursor-pointer text-sm hover:bg-gray-100 rounded-md">
                  <Pencil size={14} color="#4A4A4A" />
                  Edit
                </button>
              }
              label="Edit Deal"
            >
              {(close) => (
                <AddDealForm
                  editMode={true}
                  deal={lead}
                  onSuccess={() => {
                    close();
                  }}
                />
              )}
            </CustomDrawer>

            <button
              className="flex items-center gap-2.5 px-1.5 py-2 text-[#FB3748] hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              onClick={() => deleteDeal(lead.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader size={16} className="animate-spin" color="#FB3748" />
              ) : (
                <Trash2 size={16} color="#FB3748" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </CustomPopover>
      </div>
      {lead.industry && (
        <span className="text-xs text-white/50">{lead.industry}</span>
      )}
      {lead.value !== undefined && (
        <span className="text-xs font-medium text-white">
          ₦{lead.value.toLocaleString()}
        </span>
      )}
    </div>
  );
}
