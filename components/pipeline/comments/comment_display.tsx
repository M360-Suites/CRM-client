import { useEffect, useMemo, useRef } from "react";
import { Loader, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
	ActionMenu,
	ActionMenuItem,
} from "@/components/custom/common/action_menu";
import { useGetCommentsByStage } from "@/hooks/pipeline/comment/get_comments";
import { formatRelativeDateTime } from "@/lib/utils";
import { Comment, PipelineTeamMembers } from "@/types/pipeline";
import { MentionText } from "./mentions";

export const CommentDisplay = ({
	stageId,
	members,
	highlightId,
	editingId,
	onEdit,
	onDelete,
	scrollRef,
}: {
	stageId: string;
	members: PipelineTeamMembers[];
	// Comment to scroll to and flash, e.g. from a mention notification
	highlightId?: string | null;
	// Comment currently loaded into the composer for editing
	editingId?: string | null;
	onEdit?: (comment: Comment) => void;
	onDelete?: (comment: Comment) => void;
	// The scrolling chat area, so new messages can scroll it to the bottom
	scrollRef?: React.RefObject<HTMLDivElement | null>;
}) => {
	const { data: comments, isPending: isFetchingComments } =
		useGetCommentsByStage(stageId);
	const highlightRef = useRef<HTMLDivElement>(null);

	// Oldest first, like a chat, with the composer underneath
	const sorted = useMemo(
		() =>
			[...(comments?.data ?? [])].sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			),
		[comments],
	);
	const hasHighlight = sorted.some((c) => c.id === highlightId);
	const lastId = sorted.at(-1)?.id;

	useEffect(() => {
		if (hasHighlight) {
			highlightRef.current?.scrollIntoView({ block: "center" });
		} else if (lastId && scrollRef?.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [hasHighlight, highlightId, lastId, scrollRef]);

	if (isFetchingComments)
		return (
			<div className="flex h-full min-h-40 items-center justify-center flex-col gap-2">
				<Loader className="animate-spin" />
				<span className="text-foreground/70 text-sm">Fetching comments...</span>
			</div>
		);

	if (sorted.length === 0)
		return (
			<div className="flex h-full min-h-40 items-center justify-center flex-col gap-1 text-center">
				<span className="text-foreground/80 text-sm">No comments yet.</span>
				<span className="text-foreground/50 text-xs">
					Start the conversation below.
				</span>
			</div>
		);

	return (
		<div className="flex flex-col gap-2">
			{sorted.map((comment) => (
				<div
					key={comment.id}
					ref={comment.id === highlightId ? highlightRef : undefined}
					className={
						comment.id === highlightId ? "comment-flash p-1 -m-1" : undefined
					}
				>
					<CommentBubble
						comment={comment}
						members={members}
						isEditing={comment.id === editingId}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				</div>
			))}
		</div>
	);
};

function CommentBubble({
	comment,
	members,
	isEditing,
	onEdit,
	onDelete,
}: {
	comment: Comment;
	members: PipelineTeamMembers[];
	isEditing: boolean;
	onEdit?: (comment: Comment) => void;
	onDelete?: (comment: Comment) => void;
}) {
	const mine = comment.is_owner;
	return (
		<div className={`w-full flex ${mine ? "justify-end" : "justify-start"}`}>
			<div
				className={`w-52 max-w-[85%] p-1.5 flex flex-col gap-1 shadow-xs ${
					mine
						? "bg-[#0091FE] rounded-tr-lg rounded-bl-lg rounded-tl-lg"
						: "bg-white rounded-tr-lg rounded-br-lg rounded-tl-lg"
				} ${isEditing ? "ring-2 ring-offset-1 ring-[#0091FE]/50" : ""}`}
			>
				<span className="flex flex-row items-center justify-between gap-2">
					<h6
						className={`font-medium text-xs truncate ${
							mine ? "text-white" : "text-foreground"
						}`}
					>
						{comment.sender?.display_name ?? "Unknown member"}
					</h6>
					{mine && onEdit ? (
						<CommentMenu
							onEdit={() => onEdit(comment)}
							onDelete={onDelete && (() => onDelete(comment))}
						/>
					) : (
						<MoreVertical size={14} className="invisible" />
					)}
				</span>
				<p
					className={`text-xs whitespace-pre-wrap break-words ${
						mine ? "text-white" : "text-foreground"
					}`}
				>
					<MentionText
						content={comment.content}
						members={members}
						mentionClassName={
							mine
								? "rounded bg-white/25 px-1 font-semibold box-decoration-clone"
								: "rounded bg-[#0091FE]/15 px-1 font-medium text-[#0076D6] box-decoration-clone"
						}
					/>
				</p>
				<span
					className={`text-[9px] text-right w-full ${
						mine ? "text-white/80" : "text-foreground/60"
					}`}
				>
					{comment.edited && <span className="italic">(edited) </span>}
					{formatRelativeDateTime(comment.created_at)}
				</span>
			</div>
		</div>
	);
}

function CommentMenu({
	onEdit,
	onDelete,
}: {
	onEdit?: () => void;
	onDelete?: () => void;
}) {
	const items: ActionMenuItem[] = [];
	if (onEdit) items.push({ label: "Edit", icon: Pencil, onSelect: onEdit });
	if (onDelete)
		items.push({
			label: "Delete",
			icon: Trash2,
			destructive: true,
			onSelect: onDelete,
			confirm: {
				title: "Delete this comment",
				description: "It will be removed for everyone in this stage.",
				confirmLabel: "Delete",
			},
		});
	return (
		<ActionMenu
			items={items}
			trigger={
				<button
					type="button"
					aria-label="Comment options"
					className="shrink-0 rounded text-white/80 hover:text-white cursor-pointer"
				>
					<MoreVertical size={14} />
				</button>
			}
		/>
	);
}
