import { useDraggable } from "@dnd-kit/react";

export interface Lead {
  _id: string;
  name: string;
  company?: string;
  value?: number;
  stage: string;
}

export function Draggable({ lead }: { lead: Lead }) {
  const { ref, isDragging } = useDraggable({
    id: lead._id,
    type: "card",
    data: { lead },
  });

  return (
    <div
      ref={ref}
      className={`bg-[#FFF3E6] border rounded-[10px] p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing transition-opacity w-full ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      <span className="text-sm font-medium text-foreground">{lead.name}</span>
      {lead.company && (
        <span className="text-xs text-foreground/50">{lead.company}</span>
      )}
      {lead.value !== undefined && (
        <span className="text-xs font-medium text-[#E2725B]">
          ₦{lead.value.toLocaleString()}
        </span>
      )}
    </div>
  );
}
