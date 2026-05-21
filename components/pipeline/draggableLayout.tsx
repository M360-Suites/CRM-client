import { DragDropProvider } from "@dnd-kit/react";
import { usePipelineStore } from "@/stores/pipeline/pipeline_store";

export function DraggableLayout({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { setIsTarget } = usePipelineStore();
  const handleDragEnd = (event: any) => {
    const target = event.operation?.target;
    if (target) {
      setIsTarget(target.id);
    } else {
      setIsTarget(null);
    }
  };
  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={className}>{children}</div>
    </DragDropProvider>
  );
}
