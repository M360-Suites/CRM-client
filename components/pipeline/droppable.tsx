import { useDroppable } from "@dnd-kit/react";

interface DroppableProps {
  id: string;
  children?: React.ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
  const { ref } = useDroppable({
    id,
    accept: ["card"],
  });

  return (
    <div
      ref={ref}
      className="w-full flex-1 flex-col gap-1.5 h-50 pt-4 pb-2 px-1 flex items-start justify-start"
    >
      {children}
    </div>
  );
}
