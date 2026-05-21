import { useDraggable } from "@dnd-kit/react";

export function Draggable() {
  const { ref } = useDraggable({
    id: "draggable",
    type: "card",
  });

  return (
    <button ref={ref} className="bg-red-400 py-4 px-5">
      Draggable
    </button>
  );
}
