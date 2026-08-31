import { useGetCommentsByStage } from "@/hooks/pipeline/comment/get_comments";
import { formatRelativeDateTime } from "@/lib/utils";
import { Loader, MoreVertical } from "lucide-react";

export const CommentDisplay = ({ stageId }: { stageId: string }) => {
  const { data: comments, isPending: isFetchingComments } =
    useGetCommentsByStage(stageId);

  console.log("comments:", comments);
  return (
    <div className="max-h-75 overflow-y-auto w-full pt-2 pb-10 px-4">
      <div className="h-full">
        {isFetchingComments && (
          <div className="flex items-center justify-center flex-col gap-2">
            <Loader className="animate-spin" />
            <span className="text-black text-sm">Fetching comments...</span>
          </div>
        )}
        {!isFetchingComments && comments?.data.length === 0 && (
          <div className="flex items-center justify-center flex-col gap-2 min-h-40">
            <span className="text-black text-sm">No comments yet.</span>
          </div>
        )}
        {!isFetchingComments && comments?.data && (
          <div className="flex flex-col gap-2">
            {comments.data.map((comment) => (
              <div key={comment.id}>
                <span
                  className={`w-full flex  ${comment.is_owner ? "justify-end" : "justify-start"}`}
                >
                  {comment.is_owner && (
                    <div className=" bg-[#4a0f0a] w-44 rounded-tr-lg rounded-br-lg rounded-tl-lg p-1.5 flex flex-col gap-1">
                      <div className="flex flex-col gap-1">
                        <span className="flex flex-row justify-between">
                          <h6 className="font-medium text-white text-xs">
                            {comment.sender.display_name}
                          </h6>
                          <MoreVertical
                            size={14}
                            className="text-white/80 hover:text-white"
                          />
                        </span>
                        <p className="text-white text-xs">{comment.content}</p>
                      </div>
                      <div className="w-full">
                        <h6 className="text-white/80 text-[9px] text-right w-full">
                          {formatRelativeDateTime(comment.created_at)}
                        </h6>
                      </div>
                    </div>
                  )}
                  {!comment.is_owner && (
                    <div className="text-left bg-gray-100 p-1.5 rounded-tr-lg rounded-bl-lg rounded-tl-lg text-xs w-44 flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="flex flex-row justify-between">
                          <h6 className="font-medium text-foreground text-xs">
                            {comment.sender.display_name}
                          </h6>
                          <MoreVertical
                            size={14}
                            className="text-foreground/80 hover:text-foreground"
                          />
                        </span>
                        <p className="text-foreground text-xs">
                          {comment.content}
                        </p>
                      </div>
                      <div className="w-full">
                        <h6 className="text-foreground/80 text-[9px] text-right w-full">
                          {formatRelativeDateTime(comment.created_at)}
                        </h6>
                      </div>
                    </div>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
