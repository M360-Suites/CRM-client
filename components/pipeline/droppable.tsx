import { useDragOperation, useDroppable } from "@dnd-kit/react";
import { Deal } from "@/types/pipeline";

interface DroppableProps {
	id: string;
	children?: React.ReactNode;
	// Shown centred in the column when it has no deals to render
	emptyMessage?: string;
}

export function Droppable({ id, children, emptyMessage }: DroppableProps) {
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
			className={`w-full flex-1 flex-col gap-1.5 min-h-50 pt-4 pb-2 px-1 flex items-start justify-start rounded-b-md border-2 border-transparent ${
				isReceiving ? "droppable-receiving" : "bg-transparent"
			}`}
		>
			{emptyMessage ? (
				<div className="flex flex-1 w-full items-center justify-center px-2 text-center text-xs text-foreground/50">
					{isReceiving ? "Drop to move here" : emptyMessage}
				</div>
			) : (
				children
			)}
		</div>
	);
}
