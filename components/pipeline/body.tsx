"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import { Loader, MessageSquareText, Send } from "lucide-react";
import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { DraggableLayout } from "./draggableLayout";
import { CommentModal } from "../custom/common/comment_dialog";
import { CustomButton } from "@/components/custom/common/customButton";
import { MentionInput, getMentionedIds } from "./comments/mentions";
import { CommentDisplay } from "./comments/comment_display";
import useAddComment from "@/hooks/pipeline/comment/send_comment";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useUserProfile } from "@/hooks/user/profile";
import { useGetDealOwners } from "@/hooks/pipeline/get_deal_owners";
import AutoAssignSwitch from "./auto_assign_switch";
import AssignmentFilter, { AssignmentFilterValue } from "./assignment_filter";
import { Deal } from "@/types/pipeline";

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
	const [assignmentFilter, setAssignmentFilter] =
		useState<AssignmentFilterValue>("all");
	const { data: pipelineData, isPending } = useGetPipelineBoard();
	const { data: currentUser } = useUserProfile();
	const { data: dealOwners } = useGetDealOwners();
	const { mutate: addCommentByStage, isPending: addingComment } =
		useAddComment();
	const { stages, team_members = [] } = pipelineData || {};

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

	const matchesAssignmentFilter = (deal: Deal) => {
		const ownerId = dealOwners?.[deal.id];
		if (assignmentFilter === "mine")
			return !!currentUser && ownerId === currentUser.id;
		if (assignmentFilter === "unassigned") return !ownerId;
		return true;
	};

	if (isPending) return <PipelineSkeleton />;

	return (
		<div className="flex flex-col gap-4 w-full h-full">
			<div className="flex flex-row max-md:flex-col items-center max-md:items-start justify-between gap-3 w-full">
				<AutoAssignSwitch />
				<AssignmentFilter
					value={assignmentFilter}
					onChange={setAssignmentFilter}
				/>
			</div>
			<DraggableLayout className="w-full h-full rounded-md">
				<div className="grid xl:grid-cols-6 lg:grid-cols-4 gap-2 max-lg:grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 w-full">
					{stages?.map((stage) => {
						return (
							<div
								key={stage.id}
								className="flex flex-col border border-[#D9E1E8] rounded-md flex-1 min-w-0"
							>
								<div className="border-b border-b-[#D9E1E8] bg-white rounded-t-md p-4 max-md:p-2 flex flex-col gap-2">
									<div className="flex items-center justify-between gap-2 w-full text-foreground text-sm font-medium">
										<span className="capitalize truncate">{stage.name}</span>
										<span className="shrink-0">{stage.total_deals}</span>
									</div>
									<div className="flex items-start justify-between gap-2 w-full">
										<span className="text-foreground/80 font-medium text-sm break-all">
											₦{stage.total_value.toLocaleString()}
										</span>
										<div className="flex shrink-0 items-center pt-0.5 text-foreground/50">
											<CommentModal
												open={openModalId === stage.id}
												onOpenChange={(isOpen) =>
													handleModalChange(isOpen, stage.id)
												}
												trigger={
													<MessageSquareText
														onClick={() => setStageId(stage.id)}
														size={16}
														className="cursor-pointer hover:text-[#00B3A6]"
													/>
												}
												label={`Comments on ${stage.name}`}
											>
												<CommentDisplay
													stageId={stageId}
													members={team_members}
												/>
												<div className="flex flex-row gap-1 items-end absolute bottom-1.5 left-2 right-2">
													<MentionInput
														value={comment}
														onChange={setComment}
														members={team_members}
													/>
													<CustomButton
														disabled={!comment || addingComment}
														className="self-end px-3 py-2"
														onClick={() => {
															if (comment !== "") {
																addCommentByStage({
																	stageId: stageId,
																	content: comment,
																	mentions: getMentionedIds(
																		comment,
																		team_members,
																	),
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
									</div>
								</div>
								<Droppable id={stage.id}>
									{stage.deals.filter(matchesAssignmentFilter).map((deal) => (
										<Draggable key={deal.id} lead={deal} />
									))}
								</Droppable>
							</div>
						);
					})}
				</div>
			</DraggableLayout>
		</div>
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
