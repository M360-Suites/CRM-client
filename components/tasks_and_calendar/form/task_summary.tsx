import { Task } from "@/types/task";
import { parseDateWithTime } from "@/lib/handler";
import { formatRelativeDateTime } from "@/lib/utils";
import {
	Trash2,
	Clock,
	AlarmClock,
	UserRound,
	Settings2,
	CalendarDays,
	Briefcase,
	Link2,
	ListChecks,
} from "lucide-react";

const statusStyles: Record<Task["status"], string> = {
	pending: "bg-[#F1F5F9] text-[#64748B]",
	in_progress: "bg-[#E6F2FF] text-[#0091FE]",
	completed: "bg-[#D8F3F1] text-[#2F9E94]",
};

const priorityStyles: Record<Task["priority"], string> = {
	low: "bg-[#F1F5F9] text-[#64748B]",
	medium: "bg-[#FFF7E6] text-[#B76E00]",
	high: "bg-[#FDECEC] text-[#D92D20]",
};

// "in_progress" -> "In progress"
const humanize = (value: string) =>
	value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");

function TaskSummary({ task }: { task: Task }) {
	const { date, month, time, year } = parseDateWithTime(task.due_at);
	const end = task.duration_minutes
		? parseDateWithTime(
				new Date(
					new Date(task.due_at).getTime() + task.duration_minutes * 60_000,
				).toISOString(),
			)
		: null;
	const assignees = task.assignees.map((a) => a.display_name).join(", ");

	return (
		<div className="w-full space-y-4 p-4 font-inter">
			{/* Summary */}
			<div className="flex items-start gap-3">
				{/* Date */}
				<div className="flex h-25.5 w-20.5 shrink-0 flex-col items-center justify-center rounded-lg bg-[#F2F7FB] border border-[#D9E1E8] text-center">
					<span className="text-[28px] font-semibold leading-none text-black">
						{date}
					</span>
					<span className="mt-1 text-xs font-medium text-foreground">
						{month}
					</span>
					<span className="text-xs font-medium text-foreground">{year}</span>
					<span className="mt-2 text-xs font-semibold text-[#0091FE]">
						{time}
					</span>
				</div>

				{/* Details */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<span className="rounded-md bg-[#D8F3F1] px-2.5 py-1 text-xs font-medium text-[#2F9E94]">
							{humanize(task.type)}
						</span>
						<button
							type="button"
							className="flex h-8 items-center gap-1.5 rounded-full border border-[#F5C2C0] px-3 text-xs font-medium text-[#D92D20] cursor-pointer transition hover:bg-[#FDECEC]"
						>
							<Trash2 className="size-3.5" />
							Delete
						</button>
					</div>

					<h2 className="mt-2 text-lg font-semibold leading-tight text-black wrap-break-word">
						{task.title}
					</h2>

					{task.description && (
						<p className="mt-1.5 text-sm leading-normal text-foreground wrap-break-word">
							{task.description}
						</p>
					)}
				</div>
			</div>

			{/* Status / Priority / Reminder */}
			<section className="rounded-xl border border-[#D9E1E8] px-4 py-3">
				<div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
					<div>
						<p className="text-xs text-foreground">Status</p>
						<span
							className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}
						>
							<span className="size-1.5 rounded-full bg-current" />
							{humanize(task.status)}
						</span>
					</div>

					<div>
						<p className="text-xs text-foreground">Priority</p>
						<span
							className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
						>
							<span>↑</span>
							{humanize(task.priority)}
						</span>
					</div>

					<div>
						<p className="text-xs text-foreground">Reminder</p>
						<span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-medium text-[#64748B]">
							<AlarmClock className="size-3.5" />1 hour before
						</span>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
					<div className="min-w-0">
						<p className="text-xs text-foreground">Created by</p>
						<div className="mt-1 flex items-center gap-2 text-sm font-medium text-black">
							<UserRound className="size-3.5 shrink-0 text-[#2F9E94]" />
							<span className="truncate">{task.owner_id.display_name}</span>
						</div>
					</div>

					<div className="min-w-0">
						<p className="text-xs text-foreground">Created on</p>
						<div className="mt-1 flex items-center gap-2 text-sm font-medium text-black">
							<CalendarDays className="size-3.5 shrink-0 text-[#2F9E94]" />
							<span className="truncate">
								{formatRelativeDateTime(task.created_at)}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Task information */}
			<section className="rounded-xl border border-[#D9E1E8] px-4 py-3">
				<SectionTitle icon={<Settings2 className="size-4" />}>
					Task information
				</SectionTitle>

				<div className="space-y-3">
					<InfoRow
						label="Type"
						value={humanize(task.type)}
						icon={<ListChecks className="size-3.5" />}
					/>
					<InfoRow
						label="Assigned to"
						value={assignees || "Not assigned"}
						icon={<UserRound className="size-3.5" />}
					/>
					<InfoRow
						label="Linked deal"
						value={task.deal_id?.title || "No linked deal"}
						icon={<Briefcase className="size-3.5" />}
						muted={!task.deal_id?.title}
					/>
				</div>
			</section>

			{/* Schedule */}
			<section className="rounded-xl border border-[#D9E1E8] px-4 py-3">
				<SectionTitle icon={<CalendarDays className="size-4" />}>
					Schedule
				</SectionTitle>

				<div className="space-y-3">
					<InfoRow
						label="Start date & time"
						value={`${month} ${date}, ${year} • ${time}`}
						icon={<AlarmClock className="size-3.5" />}
					/>
					<InfoRow
						label="End date & time"
						value={
							end
								? `${end.month} ${end.date}, ${end.year} • ${end.time}`
								: "Not set"
						}
						icon={<AlarmClock className="size-3.5" />}
						muted={!end}
					/>
					<InfoRow
						label="Duration"
						value={
							task.duration_minutes
								? `${task.duration_minutes} minutes`
								: "Not set"
						}
						icon={<Clock className="size-3.5" />}
						muted={!task.duration_minutes}
					/>
					<InfoRow
						label="Meeting URL"
						value={task.meeting_url || "No meeting link"}
						icon={<Link2 className="size-3.5" />}
						href={task.meeting_url}
						muted={!task.meeting_url}
					/>
				</div>
			</section>
		</div>
	);
}

export default TaskSummary;

const SectionTitle = ({
	icon,
	children,
}: {
	icon: React.ReactNode;
	children: React.ReactNode;
}) => (
	<div className="mb-3 flex items-center gap-2 text-[#2F9E94]">
		{icon}
		<h3 className="text-sm font-semibold text-black">{children}</h3>
	</div>
);

const InfoRow = ({
	label,
	value,
	icon,
	href,
	muted = false,
}: {
	label: string;
	value: string;
	icon: React.ReactNode;
	href?: string;
	muted?: boolean;
}) => (
	<div className="grid grid-cols-[1fr_1.3fr] items-center gap-3">
		<span className="text-xs text-foreground">{label}</span>
		<div
			className={`flex min-w-0 items-center gap-2 text-sm font-medium ${
				muted ? "text-foreground/50" : "text-black"
			}`}
		>
			<span className="shrink-0 text-[#2F9E94]">{icon}</span>
			{href ? (
				<a
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					className="truncate text-[#0091FE] hover:underline"
				>
					{value}
				</a>
			) : (
				<span className="truncate">{value}</span>
			)}
		</div>
	</div>
);
