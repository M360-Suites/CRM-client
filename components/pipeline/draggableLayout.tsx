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

import {
  DragDropProvider,
  DragOverlay,
  type DragDropEventHandlers,
} from "@dnd-kit/react";
import useMoveLeadToStage from "@/hooks/pipeline/update_deals_stage";
import { Deal } from "@/types/pipeline";

type DragEndEvent = Parameters<
  NonNullable<DragDropEventHandlers["onDragEnd"]>
>[0];

function DragCard({ lead }: { lead: Deal }) {
  return (
    <div className="bg-white border border-[#0076D6] rounded-[10px] px-3 py-4 flex flex-col gap-1.5 w-full shadow-lg cursor-grabbing">
      <span className="text-sm font-medium text-[#334155] truncate">
        {lead.title}
      </span>
      {lead.industry && (
        <span className="text-xs text-black/50">{lead.industry}</span>
      )}
      <span className="text-xs font-medium text-[#0076D6]">
        ₦{(lead.value ?? 0).toLocaleString()}
      </span>
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
  const handleDragEnd = (event: DragEndEvent) => {
    const target = event.operation?.target;
    const source = event.operation?.source;

    if (event.canceled) return;
    if (!target || !source) return;
    if (source.id === target.id) return;

    const deal = source.data?.lead as Deal;
    if (deal?.stage_id === target.id) return;

    moveLeadToStage({
      dealId: String(source.id),
      stageId: String(target.id),
    });
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={className}>{children}</div>
      <DragOverlay>
        {(source) => {
          const lead = source.data?.lead as Deal | undefined;
          return lead ? <DragCard lead={lead} /> : null;
        }}
      </DragOverlay>
    </DragDropProvider>
  );
}
