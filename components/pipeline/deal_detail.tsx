import { useGetPipelineBoard } from "@/hooks/pipeline/get_pipeline_board";
import { Deal } from "@/types/pipeline";
import { formatRelativeDateTime, getInitials, toUTC } from "@/lib/utils";

export default function DealDetail({ deal }: { deal: Deal }) {
	const { data: pipelineBoard } = useGetPipelineBoard();
	const stage = pipelineBoard?.stages.find((s) => s.id === deal.stage_id);
	const assignees = stage?.assignees ?? [];
	const company = deal.company as
		| { name?: string }
		| string
		| null
		| undefined;
	const companyName =
		typeof company === "string" ? company : company?.name;

  const rows = [
		{ label: "Value", value: `₦${(deal.value ?? 0).toLocaleString()}` },
		{ label: "Stage", value: stage?.name },
		{ label: "Source", value: deal.source },
		{ label: "Industry", value: deal.industry },
		{ label: "Company", value: companyName },
		{
			label: "Stage Changed",
			value: deal.stage_changed_at
				? formatRelativeDateTime(deal.stage_changed_at)
				: undefined,
		},
		{ label: "Created", value: toUTC(deal.created_at) },
		{ label: "Last Updated", value: toUTC(deal.updated_at) },
	];

	return (
		<div className="p-4 flex flex-col gap-10">
			<div className="flex flex-row items-start gap-4 flex-1">
				<div className="bg-[#D8F3F1] h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-base font-medium text-[#2F9E94]">
					{getInitials(deal.title)}
				</div>
				<div className="flex flex-col gap-2 min-w-0">
					<div className="flex flex-col items-start">
						<span className="text-sm font-medium text-foreground break-words">
							{deal.title}
						</span>
						<span className="text-sm text-foreground/70">
							₦{(deal.value ?? 0).toLocaleString()}
						</span>
					</div>
					{stage && (
						<div
							className={`px-3 py-1 rounded-full text-xs font-normal self-start capitalize text-white ${
								stage.is_won
									? "bg-[#00B3A6]"
									: stage.is_lost
										? "bg-[#FB3748]"
										: "bg-[#0091FE]"
							}`}
						>
							{stage.name}
						</div>
					)}
				</div>
			</div>

			<div className="flex flex-col w-full">
				{rows.map((row) => (
					<div
						key={row.label}
						className="py-2 flex justify-between gap-4 w-full"
					>
						<span>{row.label}</span>
						<p className="text-sm text-foreground/70 text-right">
							{row.value || "----"}
						</p>
					</div>
				))}
			</div>

			<div className="flex flex-col gap-4">
				<span className="text-base font-medium text-foreground">
					Stage Assignees
				</span>
				{assignees.length > 0 ? (
					<div className="flex flex-col gap-3">
						{assignees.map((assignee) => (
							<div
								key={assignee.id}
								className="flex items-center gap-3"
							>
								<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00B3A6] text-xs font-semibold text-white">
									{getInitials(assignee.display_name)}
								</span>
								<div className="flex flex-col min-w-0">
									<span className="text-sm text-foreground">
										{assignee.display_name}
									</span>
									<span className="text-xs text-foreground/50 truncate">
										{assignee.email}
									</span>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="border border-dashed border-border rounded-[8px] py-10 flex justify-center items-center">
						<span className="text-sm text-foreground">
							No assignees yet
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
