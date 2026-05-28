import { useDraggable } from "@dnd-kit/react";
import { Deal } from "@/types/pipeline";

export function Draggable({ lead }: { lead: Deal }) {
  const { ref, isDragging } = useDraggable({
    id: lead.id,
    type: "card",
    data: { lead },
  });

  return (
    <div
      ref={ref}
      style={{ transition: isDragging ? "none" : undefined }}
      className={`bg-[#FFF3E6] border rounded-[10px] p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing w-full ${
        isDragging ? "hidden" : "opacity-100"
      }`}
    >
      <span className="text-sm font-medium text-foreground">{lead.title}</span>
      {lead.industry && (
        <span className="text-xs text-foreground/50">{lead.industry}</span>
      )}
      {lead.value !== undefined && (
        <span className="text-xs font-medium text-[#E2725B]">
          ₦{lead.value.toLocaleString()}
        </span>
      )}
    </div>
  );
}
