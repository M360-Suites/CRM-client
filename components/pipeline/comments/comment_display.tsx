import { useGetCommentsByStage } from "@/hooks/pipeline/comment/get_comments";
import { Loader } from "lucide-react";

export const CommentDisplay = ({ stageId }: { stageId: string }) => {
  const { data: comments, isPending: isFetchingComments } =
    useGetCommentsByStage(stageId);
  console.log("comments on display:", comments?.data);
  return (
    <div className="max-h-75 overflow-y-auto w-full pt-2 pb-10">
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
                    <div className=" bg-[#FFF3E6] w-44 rounded-tr-lg rounded-br-lg rounded-tl-lg p-1.5 flex flex-col gap-1">
                      <h6 className="font-semibold text-foreground/90 text-[10px]">
                        {comment.sender.display_name}
                      </h6>
                      <p className="text-foreground text-xs">
                        {comment.content}
                      </p>
                    </div>
                  )}
                  {!comment.is_owner && (
                    <div className="text-left bg-gray-100 p-1.5 rounded-tr-lg rounded-bl-lg rounded-tl-lg text-xs w-44">
                      <h6 className="font-semibold text-foreground/85 text-[10px]">
                        {comment.sender.display_name}
                      </h6>
                      <p className="text-foreground text-xs">
                        {comment.content}
                      </p>
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
