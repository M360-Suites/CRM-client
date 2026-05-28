// import { DragDropProvider } from "@dnd-kit/react";
// import useMoveLeadToStage from "@/hooks/pipeline/update_deals_stage";
// import { Deal } from "@/types/pipeline";

// export function DraggableLayout({
//   className,
//   children,
// }: {
//   className?: string;
//   children?: React.ReactNode;
// }) {
//   const { mutate: moveLeadToStage } = useMoveLeadToStage();

//   const handleDragEnd = (event: any) => {
//     const target = event.operation?.target;
//     const source = event.operation?.source;

//     if (!target || !source) return;
//     if (source.id === target.id) return;

//     const deal = source.data?.lead as Deal;
//     if (deal?.stage_id === target.id) return;

//     moveLeadToStage({ dealId: source.id, stageId: target.id });
//   };

//   return (
//     <DragDropProvider onDragEnd={handleDragEnd}>
//       <div className={className}>{children}</div>
//     </DragDropProvider>
//   );
// }

import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { useState } from "react";
import useMoveLeadToStage from "@/hooks/pipeline/update_deals_stage";
import { Deal } from "@/types/pipeline";

function DragCard({ lead }: { lead: Deal }) {
  return (
    <div className="bg-[#FFF3E6] border rounded-[10px] p-3 flex flex-col gap-2 w-full shadow-lg cursor-grabbing">
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

export function DraggableLayout({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { mutate: moveLeadToStage } = useMoveLeadToStage();
  const [activeLead, setActiveLead] = useState<Deal | null>(null);

  const handleDragStart = (event: any) => {
    setActiveLead(event.operation?.source?.data?.lead ?? null);
  };

  const handleDragEnd = (event: any) => {
    const target = event.operation?.target;
    const source = event.operation?.source;

    setActiveLead(null);

    if (!target || !source) return;
    if (source.id === target.id) return;

    const deal = source.data?.lead as Deal;
    if (deal?.stage_id === target.id) return;

    moveLeadToStage({ dealId: source.id, stageId: target.id });
  };

  return (
    <DragDropProvider onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={className}>{children}</div>
      <DragOverlay>
        {activeLead ? <DragCard lead={activeLead} /> : null}
      </DragOverlay>
    </DragDropProvider>
  );
}
