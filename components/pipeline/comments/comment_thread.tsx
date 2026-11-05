"use client";

import { useRef, useState } from "react";
import { Loader, Pencil, Send, X } from "lucide-react";
import { CustomButton } from "@/components/custom/common/customButton";
import useAddComment from "@/hooks/pipeline/comment/send_comment";
import useEditComment from "@/hooks/pipeline/comment/edit_comment";
import useDeleteComment from "@/hooks/pipeline/comment/delete_comment";
import { Comment, PipelineTeamMembers } from "@/types/pipeline";
import { CommentDisplay } from "./comment_display";
import { MentionInput, getMentionedIds } from "./mentions";

// Stage discussion: a scrolling chat area above a separate composer
export function CommentThread({
	stageId,
	members,
	highlightId,
}: {
	stageId: string;
	members: PipelineTeamMembers[];
	highlightId?: string | null;
}) {
	const [draft, setDraft] = useState("");
	const [editing, setEditing] = useState<Comment | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const { mutate: addComment, isPending: adding } = useAddComment();
	const { mutate: editComment, isPending: savingEdit } = useEditComment();
	const { mutate: deleteComment } = useDeleteComment();
	const busy = adding || savingEdit;

	const removeComment = (comment: Comment) => {
		if (editing?.id === comment.id) cancelEdit();
		deleteComment({ stageId, messageId: comment.id });
	};

	const startEdit = (comment: Comment) => {
		setEditing(comment);
		setDraft(comment.content);
	};

	const cancelEdit = () => {
		setEditing(null);
		setDraft("");
	};

	const submit = () => {
		const content = draft.trim();
		if (!content || busy) return;
		const mentions = getMentionedIds(content, members);
		if (editing) {
			if (content !== editing.content) {
				editComment({ stageId, messageId: editing.id, content, mentions });
			}
			cancelEdit();
			return;
		}
		addComment({ stageId, content, mentions });
		setDraft("");
	};

	return (
		<div className="flex h-[min(60vh,26rem)] flex-col gap-2">
			<div
				ref={scrollRef}
				className="no-scrollbar flex-1 overflow-y-auto rounded-lg bg-[#EEF3F8] px-3 py-3"
			>
				<CommentDisplay
					stageId={stageId}
					members={members}
					highlightId={highlightId}
					editingId={editing?.id}
					onEdit={startEdit}
					onDelete={removeComment}
					scrollRef={scrollRef}
				/>
			</div>

			<div className="flex flex-col gap-1.5 rounded-lg border border-[#E2E8F0] bg-white p-1.5">
				{editing && (
					<div className="flex items-start justify-between gap-2 rounded-md border-l-3 border-[#0091FE] bg-[#0091FE]/5 px-2 py-1.5">
						<div className="flex min-w-0 flex-col">
							<span className="flex items-center gap-1 text-[10px] font-medium text-[#0076D6]">
								<Pencil size={10} />
								Editing message
							</span>
							<span className="truncate text-xs text-foreground/60">
								{editing.content}
							</span>
						</div>
						<button
							type="button"
							aria-label="Cancel editing"
							onClick={cancelEdit}
							className="shrink-0 rounded p-0.5 text-foreground/50 hover:bg-gray-100 hover:text-foreground cursor-pointer"
						>
							<X size={14} />
						</button>
					</div>
				)}
				<div className="flex flex-row items-end gap-1">
					<MentionInput
						value={draft}
						onChange={setDraft}
						members={members}
						onSubmit={submit}
						onCancel={editing ? cancelEdit : undefined}
					/>
					<CustomButton
						disabled={!draft.trim() || busy}
						className="self-end px-3 py-2"
						aria-label={editing ? "Save edit" : "Send comment"}
						onClick={submit}
					>
						{busy ? <Loader className="animate-spin" /> : <Send size={12} />}
					</CustomButton>
				</div>
			</div>
		</div>
	);
}
