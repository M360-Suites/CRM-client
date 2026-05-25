import { DragDropProvider } from "@dnd-kit/react";
import { usePipelineStore } from "@/stores/pipeline/pipeline_store";

export function DraggableLayout({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { moveLeadToStage } = usePipelineStore();

  const handleDragEnd = (event: any) => {
    const target = event.operation?.target;
    const source = event.operation?.source;

    if (target && source) {
      moveLeadToStage(source.id, target.id); // 👈 move lead to new stage
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={className}>{children}</div>
    </DragDropProvider>
  );
}
