import { Task } from "@/types/task";
import { parseDateWithTime } from "@/lib/handler";
import { formatRelativeDateTime } from '@/lib/utils'
import { Trash2, Clock, User, Calendar, AlarmClock, Flag, X, UserRound } from "lucide-react";

function TaskSummary({ task }: { task: Task }) {
	const { date, month, time, year } = parseDateWithTime(task.due_at);
	console.log("TaskSummary task:", task);
	const assignees = task.assignees.join(",")

	return (
		<div className="w-full space-y-4 p-4 font-inter">
			{/* Meeting Summary */}
			<div className="flex items-start gap-3">
				{/* Date */}
				<div className="flex h-25.5 w-20.5 shrink-0 flex-col items-center justify-center rounded-lg bg-[#fff9e8] text-center">
					<span className="text-[28px] font-semibold leading-none text-slate-800">
						{date}
					</span>

					<span className="mt-1 text-[11px] font-medium text-slate-700">
						{month}
					</span>

					<span className="text-[11px] font-medium text-slate-700">
						{year}
					</span>

					<span className="mt-2 text-[12px] font-semibold text-sky-500">
						{time}
					</span>
				</div>

				{/* Meeting details */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<span className="rounded-md bg-[#fff9e8] px-2.5 py-1 text-[11px] font-medium text-sky-500">
							{task.type}
						</span>

						<div className="flex items-center gap-2">
							<button
								type="button"
								className="flex h-8 items-center gap-1.5 rounded-full border border-red-300 px-3 text-xs font-medium text-red-400 cursor-pointer transition hover:bg-red-50"
							>
								<Trash2 className="size-3.5 text-red-400" />
								Delete
							</button>
						</div>
					</div>

					<h2 className="mt-1 text-[18px] font-semibold leading-tight text-slate-800">
						{task.title}
					</h2>

					<p className="mt-2 text-[11px] leading-normal text-slate-500">
						{task.description}
					</p>
				</div>
			</div>

			{/* Status / Priority / Reminder */}
			<section className="rounded-2xl border border-slate-100 px-4 py-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
				<div className="grid grid-cols-3 gap-4">
					{/* Status */}
					<div>
						<p className="text-[10px] font-medium text-slate-500">
							Status
						</p>

						<span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-500">
							<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
							{task.status}
						</span>
					</div>

					{/* Priority */}
					<div>
						<p className="text-[10px] font-medium text-slate-500">
							Priority
						</p>

						<span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-medium text-orange-500">
							<span className="text-[10px]">↑</span>
							{task.priority}
						</span>
					</div>

					{/* Reminder */}
					<div>
						<p className="text-[10px] font-medium text-slate-500">
							Reminder
						</p>

						<span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-slate-500">
							<AlarmClock className="size-3.5 text-slate-400" />1 hour before
						</span>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-x-6">
					<div>
						<p className="text-[10px] font-medium text-slate-500">
							Created By
						</p>
						<div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
							<UserRound className="size-3 text-slate-400" />
							{task.owner_id.display_name}
						</div>
					</div>

					<div>
						<p className="text-[10px] font-medium text-slate-500">
							Created on
						</p>
						<div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
							<AlarmClock className="size-3 text-slate-400" />
							{formatRelativeDateTime(task.created_at)}
						</div>
					</div>
				</div>
			</section>

			{/* Task Information */}
			<section className="rounded-2xl border border-slate-100 px-4 py-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
				<div className="mb-3 flex items-center gap-2">
					<span className="text-sm text-slate-500">⚙</span>
					<h3 className="text-[11px] font-semibold text-slate-600">
						Task Information
					</h3>
				</div>

				<div className="space-y-2.5">
					<InfoRow label="Type" value={task.type} icon="⚙" />

					<InfoRow
						label="Assigned To"
						value={assignees || "Not Assigned"}
						icon={<UserRound className="size-3 text-slate-400" />}
					/>

					<InfoRow
						label="Linked Deal"
						value={task.deal_id?.title || "No linked deals"}
						icon="▱"
						valueClassName="text-red-300"
					/>
				</div>
			</section>

			{/* Schedule */}
			<section className="rounded-2xl border border-slate-100 px-4 py-3 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
				<div className="mb-3 flex items-center gap-2">
					<span className="text-sm text-slate-500">▣</span>
					<h3 className="text-[11px] font-semibold text-slate-600">
						Schedule
					</h3>
				</div>

				<div className="space-y-2.5">
					<InfoRow
						label="Start Date & Time"
						value={month + " " + date + ", " + year + " • " + time}
						icon={<AlarmClock className="size-3 text-slate-400" />}
					/>

					<InfoRow
						label="End Date & Time"
						value={month + " " + date + " " + year}
						icon={<AlarmClock className="size-3 text-slate-400" />}
					/>

					<InfoRow label="Duration" value={task.duration_minutes + " " + 'minutes' || ''} icon={<Clock className="size-3 text-slate-400" />} />

					<InfoRow
						label="Meeting URL"
						value={task.meeting_url || "No meeting link"}
						icon="↗"
						valueClassName="text-blue-500"
					/>


				</div>
			</section>
		</div>
	);
}

export default TaskSummary;

const InfoRow = ({
	label,
	value,
	icon,
	valueClassName = "text-slate-600",
}: {
	label: string;
	value: string;
	icon: React.ReactNode | string;
	valueClassName?: string;
}) => (
	<div className="grid grid-cols-[1fr_1.15fr] items-center gap-3">
		<span className="text-[10px] text-slate-500">{label}</span>

		<div
			className={`flex min-w-0 items-center gap-2 text-[10px] font-medium ${valueClassName}`}
		>
			{typeof icon === "string" ? (
				<span className="shrink-0 text-[12px] text-slate-500">{icon}</span>
			) : (
				icon
			)}
			<span className="truncate">{value}</span>
		</div>
	</div>
);
