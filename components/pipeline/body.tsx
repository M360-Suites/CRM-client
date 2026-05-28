"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import { UserRound, UserRoundPlus } from "lucide-react";
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { DraggableLayout } from "./draggableLayout";

export default function Body() {
  const { data: pipelineData, isPending } = useGetPipelineBoard();
  const pipeline = pipelineData?.data ?? pipelineData;
  console.log("pipeline:", pipeline);

  const stages = pipeline?.stages || [];

  if (isPending) return <PipelineSkeleton />;

  return (
    <DraggableLayout className="w-full h-full rounded-md">
      <div className="flex w-full gap-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex flex-col border rounded-md flex-1 min-w-0"
          >
            <div className="border-b p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between w-full text-foreground text-sm font-medium">
                  <span className="capitalize">{stage.name}</span>
                  <span>{stage.total_deals}</span>
                </div>
                <span className="text-foreground font-normal">
                  ₦{stage.total_value.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                {stage.assignedTo ? (
                  <div className="flex -space-x-2">
                    <span>{stage.assignedTo.display_name}</span>
                    <UserRound size={18} />
                  </div>
                ) : (
                  <div className="flex flex-row-reverse items-center gap-1 text-foreground/50 text-xs">
                    <UserRoundPlus size={14} />
                    <span>No assignees</span>
                  </div>
                )}
              </div>
            </div>
            <Droppable id={stage.id}>
              {stage.deals.map((deal) => (
                <Draggable key={deal.id} lead={deal} />
              ))}
            </Droppable>
          </div>
        ))}
      </div>
    </DraggableLayout>
  );
}

function PipelineSkeleton() {
  return (
    <div className="flex w-full gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col border rounded-md flex-1 min-w-0 animate-pulse"
        >
          <div className="border-b p-4 flex flex-col gap-3">
            <div className="h-3.5 w-24 bg-gray-200 rounded-full" />
            <div className="h-3 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="p-2 flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="h-16 bg-gray-100 rounded-[10px]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
