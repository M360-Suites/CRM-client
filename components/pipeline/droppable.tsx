import { useDragOperation, useDroppable } from "@dnd-kit/react";
import { Deal } from "@/types/pipeline";

interface DroppableProps {
	id: string;
	children?: React.ReactNode;
}

export function Droppable({ id, children }: DroppableProps) {
	const { ref, isDropTarget } = useDroppable({
		id,
		accept: ["card"],
	});
	const { source } = useDragOperation();
	const sourceLead = source?.data?.lead as Deal | undefined;
	const isReceiving = isDropTarget && sourceLead?.stage_id !== id;

	return (
		<div
			ref={ref}
			className={`w-full flex-1 flex-col gap-1.5 h-50 pt-4 pb-2 px-1 flex items-start justify-start rounded-b-md border-2 border-transparent ${
				isReceiving ? "droppable-receiving" : "bg-transparent"
			}`}
		>
			{children}
		</div>
	);
}
