"use client";

import { Droppable } from "./droppable";
import { Draggable } from "@/components/pipeline/draggable";
import { Inbox, Loader, MessageSquareText, Send } from "lucide-react";
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
import AssignmentFilter, {
	AssignmentFilterValue,
	memberIdFromFilter,
} from "./assignment_filter";
import TeamWorkload from "./team_workload";
import { useCanManageDealAssignment } from "@/hooks/user/permissions";
import { Deal } from "@/types/pipeline";

export default function Body() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const queryStageId = searchParams.get("stageId");
	const queryCommentId = searchParams.get("commentId");
	const [comment, setComment] = useState("");
	const [stageId, setStageId] = useState(queryStageId || "");
	const [openModalId, setOpenModalId] = useState<string | null>(
		queryStageId || null,
	);
	// Re-open the thread when a notification links here while already on /pipeline
	const [syncedStageId, setSyncedStageId] = useState(queryStageId);
	if (queryStageId !== syncedStageId) {
		setSyncedStageId(queryStageId);
		if (queryStageId) {
			setStageId(queryStageId);
			setOpenModalId(queryStageId);
		}
	}
	const [assignmentFilter, setAssignmentFilter] =
		useState<AssignmentFilterValue>("all");
	const { data: pipelineData, isPending } = useGetPipelineBoard();
	const { data: currentUser } = useUserProfile();
	const canManageAssignments = useCanManageDealAssignment();
	const {
		data: dealOwners,
		isPending: ownersPending,
		isError: ownersError,
	} = useGetDealOwners();
	const { mutate: addCommentByStage, isPending: addingComment } =
		useAddComment();
	const { stages, team_members = [] } = pipelineData || {};

	const handleModalChange = (isOpen: boolean, currentStageId: string) => {
		if (isOpen) {
			setStageId(currentStageId);
			setOpenModalId(currentStageId);
		} else {
			setOpenModalId(null);
			// Drop ?stageId/&commentId so the thread doesn't reopen on refresh
			if (queryStageId) {
				router.replace(pathname, { scroll: false });
			}
		}
	};

	// Sales reps only ever see the deals assigned to them
	const isSalesRep = currentUser?.role === "sales_rep";
	const activeFilter: AssignmentFilterValue = isSalesRep
		? "mine"
		: assignmentFilter;
	const isFiltered = activeFilter !== "all";
	const selectedMemberId = memberIdFromFilter(activeFilter);
	const selectedMemberName = selectedMemberId
		? (team_members.find((m) => m.id === selectedMemberId)?.display_name ??
			"This member")
		: null;

	const matchesAssignmentFilter = (deal: Deal) => {
		const ownerId = dealOwners?.[deal.id];
		if (activeFilter === "mine")
			return !!currentUser && ownerId === currentUser.id;
		if (activeFilter === "unassigned") return !ownerId;
		if (selectedMemberId) return ownerId === selectedMemberId;
		return true;
	};

	// Filtering needs the owners map; don't flash an empty board while it loads
	if (isPending || (isFiltered && ownersPending)) return <PipelineSkeleton />;

	const visibleStages = (stages ?? []).map((stage) => {
		const deals = stage.deals.filter(matchesAssignmentFilter);
		return {
			...stage,
			deals,
			// Backend totals cover every deal, so recount when filtered
			total_deals: isFiltered ? deals.length : stage.total_deals,
			total_value: isFiltered
				? deals.reduce((sum, deal) => sum + (deal.value ?? 0), 0)
				: stage.total_value,
		};
	});
	const visibleDealCount = visibleStages.reduce(
		(sum, stage) => sum + stage.deals.length,
		0,
	);
	const boardNotice = getBoardNotice({
		hasStages: visibleStages.length > 0,
		visibleDealCount,
		filter: activeFilter,
		isSalesRep,
		memberName: selectedMemberName,
		ownersError: isFiltered && ownersError,
	});
	const columnEmptyMessage = selectedMemberName
		? `No deals for ${selectedMemberName} in this stage`
		: COLUMN_EMPTY_MESSAGES[activeFilter as keyof typeof COLUMN_EMPTY_MESSAGES];

	return (
		<div className="flex flex-col gap-4 w-full flex-1">
			{!isSalesRep && (
				<div className="flex flex-row max-md:flex-col items-center max-md:items-start justify-between gap-3 w-full">
					{canManageAssignments && <AutoAssignSwitch />}
					<div className="flex flex-wrap items-center gap-2 ml-auto max-md:ml-0">
						<AssignmentFilter
							value={assignmentFilter}
							onChange={setAssignmentFilter}
						/>
						{canManageAssignments && (
							<TeamWorkload
								value={assignmentFilter}
								onChange={setAssignmentFilter}
								members={team_members}
								owners={dealOwners}
							/>
						)}
					</div>
				</div>
			)}
			{boardNotice && <BoardNotice {...boardNotice} />}
			{visibleStages.length > 0 && (
				<DraggableLayout className="w-full flex-1 flex flex-col rounded-md">
					<div className="grid xl:grid-cols-6 lg:grid-cols-4 gap-2 max-lg:grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 w-full flex-1">
						{visibleStages.map((stage) => {
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
														highlightId={
															openModalId === stage.id ? queryCommentId : null
														}
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
									<Droppable
										id={stage.id}
										emptyMessage={
											stage.deals.length === 0 ? columnEmptyMessage : undefined
										}
									>
										{stage.deals.map((deal) => (
											<Draggable key={deal.id} lead={deal} />
										))}
									</Droppable>
								</div>
							);
						})}
					</div>
				</DraggableLayout>
			)}
		</div>
	);
}

const COLUMN_EMPTY_MESSAGES = {
	all: "No deals in this stage",
	mine: "None of your deals are in this stage",
	unassigned: "No unassigned deals in this stage",
} as const;

type Notice = { title: string; description: string; tone?: "error" };

function getBoardNotice({
	hasStages,
	visibleDealCount,
	filter,
	isSalesRep,
	memberName,
	ownersError,
}: {
	hasStages: boolean;
	visibleDealCount: number;
	filter: AssignmentFilterValue;
	isSalesRep: boolean;
	memberName: string | null;
	ownersError: boolean;
}): Notice | null {
	if (ownersError)
		return {
			title: "Couldn't load deal assignments",
			description:
				"We couldn't tell who owns each deal, so this view may be incomplete. Refresh to try again.",
			tone: "error",
		};
	if (!hasStages)
		return {
			title: "Your pipeline has no stages yet",
			description: "Once stages are set up, your deals will show up here.",
		};
	if (visibleDealCount > 0) return null;
	if (memberName)
		return {
			title: `${memberName} has no deals assigned yet`,
			description:
				"Open a deal and set its owner, or turn on auto-assign, to give them work.",
		};
	if (filter === "mine")
		return {
			title: "No deals assigned to you yet",
			description: isSalesRep
				? "When a manager assigns you a deal, it will show up here."
				: "Deals assigned to you will show up here.",
		};
	if (filter === "unassigned")
		return {
			title: "Every deal has an owner",
			description: "There are no unassigned deals right now.",
		};
	return {
		title: "No deals in your pipeline yet",
		description: "Add a deal or import a list to get started.",
	};
}

function BoardNotice({ title, description, tone }: Notice) {
	return (
		<div
			className={`flex items-start gap-3 rounded-md border border-dashed px-4 py-3 ${
				tone === "error"
					? "border-red-200 bg-red-50"
					: "border-[#D9E1E8] bg-white"
			}`}
		>
			<Inbox
				size={18}
				className={`mt-0.5 shrink-0 ${
					tone === "error" ? "text-red-500" : "text-[#00B3A6]"
				}`}
			/>
			<div className="flex flex-col gap-0.5">
				<span className="text-sm font-medium text-foreground">{title}</span>
				<span className="text-xs text-foreground/60">{description}</span>
			</div>
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
