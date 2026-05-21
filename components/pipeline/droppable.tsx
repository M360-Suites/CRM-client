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
      className="w-full h-50 bg-yellow-300 border rounded-md flex items-center justify-center"
    >
      {children}
    </div>
  );
}
