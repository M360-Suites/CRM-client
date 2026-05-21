"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import { usePipelineStore } from "@/stores/pipeline/pipeline_store";

import { DraggableLayout } from "./draggableLayout";
export default function Body() {
  const { isTarget } = usePipelineStore();
  return (
    <DraggableLayout className="w-full h-120 bg-gray-200 rounded-md flex items-center justify-between ">
      <div className="flex flex-col items-center justify-center w-full h-full">
        {!isTarget ? <Draggable /> : null}
        <div className="flex gap-4 mt-4 w-full">
          <Droppable id="droppable1">
            {isTarget === "droppable1" && <Draggable />}
          </Droppable>
          <Droppable id="droppable2">
            {isTarget === "droppable2" && <Draggable />}
          </Droppable>
        </div>
      </div>
    </DraggableLayout>
  );
}
