"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import {
  Check,
  Loader,
  Trash2,
  UserRoundPlus,
  MessageSquareText,
  Send,
} from "lucide-react";
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { DraggableLayout } from "./draggableLayout";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { CommentModal } from "../custom/common/comment_dialog";
import { CustomButton } from "@/components/custom/common/customButton";
import useAssignDeal from "@/hooks/pipeline/assign_stage";
import { useDeleteAssigned } from "@/hooks/pipeline/delete_assigned_user";
import CommentInput from "../custom/common/comment_input";
import { CommentDisplay } from "./comments/comment_display";
import { getInitials } from "@/lib/utils";
import useAddComment from "@/hooks/pipeline/comment/send_comment";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Body() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryStageId = searchParams.get("stageId");
  const [comment, setComment] = useState("");
  const [stageId, setStageId] = useState(queryStageId || "");
  const [openModalId, setOpenModalId] = useState<string | null>(
    queryStageId || null,
  );
  const { data: pipelineData, isPending } = useGetPipelineBoard();
  const { mutate: addCommentByStage, isPending: addingComment } =
    useAddComment();
  const { stages, team_members } = pipelineData || {};
  const {
    mutate: assignDeal,
    isPending: isAssigning,
    variables,
  } = useAssignDeal();
  const {
    mutate: deleteAssignedUser,
    isPending: isDeleting,
    variables: deleteVariables,
  } = useDeleteAssigned();

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleModalChange = (isOpen: boolean, currentStageId: string) => {
    if (isOpen) {
      setStageId(currentStageId);
      setOpenModalId(currentStageId);
    } else {
      setOpenModalId(null);
      // Optional: Remove ?stageId from the URL so it doesn't reopen on refresh
      if (queryStageId) {
        router.replace(pathname, { scroll: false });
      }
    }
  };

  console.log("StageId and Comment:", stageId, comment);

  if (isPending) return <PipelineSkeleton />;

  return (
    <DraggableLayout className="w-full h-full rounded-md">
      <div className="grid xl:grid-cols-6 lg:grid-cols-4 gap-2 max-lg:grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 w-full">
        {stages?.map((stage) => {
          const assignedUsers = stage.assignees ?? [];
          return (
            <div
              key={stage.id}
              className="flex flex-col border rounded-md bg-white flex-1 min-w-0"
            >
              <div className="border-b p-4 max-md:p-2 flex flex-col gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between w-full text-foreground text-sm font-medium">
                    <span className="capitalize">{stage.name}</span>
                    <span>{stage.total_deals}</span>
                  </div>
                  <span className="text-foreground/80 font-medium text-sm">
                    ₦{stage.total_value.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-row-reverse items-center w-full justify-between gap-1 text-foreground/50 text-xs">
                    <div className="flex flex-row items-center gap-3">
                      <CustomPopover
                        trigger={
                          <UserRoundPlus
                            size={16}
                            className="cursor-pointer hover:text-foreground"
                          />
                        }
                        title="Team members"
                      >
                        <div className="flex flex-col gap-1 items-start justify-start bg-white min-w-30">
                          <div className="flex flex-col gap-1 w-full">
                            {team_members?.map((member) => (
                              <CustomButton
                                variant="secondary"
                                disabled={isAssigning}
                                onClick={() =>
                                  assignDeal({
                                    stage_id: stage.id,
                                    user_id: member.id,
                                  })
                                }
                                key={member.id}
                                className="px-2 py-1 w-full flex  justify-start cursor-pointer hover:bg-[#FFF3E6]/80 rounded-md  text-sm text-foreground font-norma cursor-pointerl"
                              >
                                <div className="flex w-full items-center justify-between gap-2">
                                  <div className="flex min-w-0 flex-col items-start text-left">
                                    <span className="text-xs text-start">
                                      {member.display_name}
                                    </span>
                                    <span className="text-[9px] font-medium text-foreground/50">
                                      {member.email}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {assignedUsers.some(
                                      (assignedUser) =>
                                        assignedUser.id === member.id,
                                    ) && (
                                      <Check
                                        size={5}
                                        className=" text-foreground"
                                      />
                                    )}
                                    {assignedUsers.some(
                                      (assignedUser) =>
                                        assignedUser.id === member.id,
                                    ) && (
                                      <button
                                        type="button"
                                        disabled={
                                          isDeleting &&
                                          deleteVariables?.stageId ===
                                            stage.id &&
                                          deleteVariables?.userId === member.id
                                        }
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          event.preventDefault();
                                          deleteAssignedUser({
                                            stageId: stage.id,
                                            userId: member.id,
                                          });
                                        }}
                                        className="inline-flex items-center justify-center text-foreground/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                        aria-label="Delete assigned user"
                                      >
                                        {isDeleting &&
                                        deleteVariables?.stageId === stage.id &&
                                        deleteVariables?.userId ===
                                          member.id ? (
                                          <Loader className="animate-spin text-lg" />
                                        ) : (
                                          <Trash2
                                            size={5}
                                            className="text-foundation-error-6 cursor-pointer text-sm"
                                          />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {isAssigning &&
                                  variables?.stage_id === stage.id &&
                                  variables?.user_id === member.id && (
                                    <Loader className="animate-spin" />
                                  )}
                              </CustomButton>
                            ))}
                          </div>
                        </div>
                      </CustomPopover>
                      <CommentModal
                        open={openModalId === stage.id}
                        onOpenChange={(isOpen) =>
                          handleModalChange(isOpen, stage.id)
                        }
                        trigger={
                          <MessageSquareText
                            onClick={() => setStageId(stage.id)}
                            size={16}
                            className="cursor-pointer hover:text-foreground"
                          />
                        }
                        label={`Comments on ${stage.name}`}
                      >
                        <CommentDisplay stageId={stageId} />
                        <div className="flex flex-row gap-1 items-end absolute bottom-1.5 left-2 right-2">
                          <CommentInput
                            type="text"
                            value={comment}
                            textArea={true}
                            onChange={handleCommentChange}
                          />
                          <CustomButton
                            disabled={!comment || addingComment}
                            className="self-end p-2"
                            onClick={() => {
                              if (comment !== "") {
                                addCommentByStage({
                                  stageId: stageId,
                                  content: comment,
                                });
                              }
                              setComment("");
                            }}
                          >
                            {addingComment ? (
                              <Loader className="animate-spin" />
                            ) : (
                              <Send size={12} />
                            )}
                          </CustomButton>
                        </div>
                      </CommentModal>
                    </div>
                    <div className="flex items-center relative gap-1 flex-wrap justify-end">
                      {assignedUsers.length > 0 ? (
                        <>
                          {assignedUsers
                            .slice(0, 3)
                            .map((assignedUser, index) => (
                              <span
                                key={assignedUser.id}
                                className={`inline-flex h-6 w-6 py-2 items-center justify-center font-semibold rounded-full bg-[#E2725B] border border-[#3A2418] p-1.5 text-[10px] text-white ${index > 0 ? "-ml-2 top-4" : ""}`}
                                style={{
                                  zIndex: assignedUsers.length - index,
                                }}
                              >
                                {getInitials(assignedUser.display_name)}
                              </span>
                            ))}
                          {assignedUsers.length > 3 && (
                            <span
                              className="inline-flex h-6 w-6 items-center justify-center font-semibold rounded-full bg-[#E2725B] border border-[#fcafa0] p-1.5 text-[10px] text-foreground -ml-2"
                              style={{
                                zIndex: 1,
                              }}
                            >
                              +{assignedUsers.length - 3}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-foreground/50">
                          No assignees
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Droppable id={stage.id}>
                {stage.deals.map((deal) => (
                  <Draggable key={deal.id} lead={deal} />
                ))}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DraggableLayout>
  );
}

function PipelineSkeleton() {
  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-4 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
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
