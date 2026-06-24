"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import { UserRound, UserRoundPlus, Loader } from "lucide-react";
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { DraggableLayout } from "./draggableLayout";
import { CustomPopover } from "@/components/custom/common/customPopover";
import {CustomButton} from "@/components/custom/common/customButton";
import useAssignDeal from "@/hooks/pipeline/assign_stage";

export default function Body() {
  const { data: pipelineData, isPending } = useGetPipelineBoard();
	const { stages, team_members } = pipelineData || {};
  const { mutate: assignDeal, isPending: isAssigning, variables } = useAssignDeal();
  console.log("pipeline:", pipelineData);

  if (isPending) return <PipelineSkeleton />;

  return (
    <DraggableLayout className="w-full h-full rounded-md">
      <div className="flex w-full gap-3">
        {stages?.map((stage) => (
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
                {/* {stage.assignedTo ? (
                  <div className="flex -space-x-2 w-full justify-between items-center text-foreground text-xs font-normal">
                    <span className="text-xs text-start">{stage.assignedTo.display_name}</span>
                    <UserRound size={16} />
                  </div>
                ) : ( */}
                  <div className="flex flex-row-reverse items-center w-full justify-between gap-1 text-foreground/50 text-xs">
                      
                      <CustomPopover trigger={<UserRoundPlus size={14}  className="cursor-pointer hover:text-foreground"/>} title="Team members">
										<div className="flex flex-col gap-1 items-start justify-start bg-white min-w-30">
											
											<div className="flex flex-col gap-1 w-full">
                                            {team_members?.map((member) => (
												<CustomButton
													variant="secondary"
													disabled={isAssigning}
													onClick={() => assignDeal({ stage_id: stage.id, user_id: member.id })}
													key={member.id}
													className="px-2 py-2 w-full flex  justify-start cursor-pointer hover:bg-[#FFF3E6] rounded-md  text-sm text-foreground font-norma cursor-pointerl"
											  >
													<span className="text-xs text-start">{member.display_name}</span>
													<span className="text-[9px] font-medium text-foreground/50">{member.email}</span>
                          {isAssigning && variables?.stage_id === stage.id && variables?.user_id === member.id && (
                            <Loader className="animate-spin" />
                          )}
													
											  </CustomButton>
											))}
											</div>
                                          </div>
                                        </CustomPopover>
                    <span className={`text-xs text-start ${stage.assignedTo ? 'text-foreground' : 'text-foreground/50'}`}>{stage.assignedTo?.display_name || "No assignees"}</span>
                    </div>
                    
                {/* )} */}
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
