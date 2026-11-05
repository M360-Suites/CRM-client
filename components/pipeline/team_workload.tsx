"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, UserPlus, Users } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useGetStaffs } from "@/hooks/user/admin/get_staffs";
import { getInitials } from "@/lib/utils";
import { PipelineTeamMembers } from "@/types/pipeline";
import {
	AssignmentFilterValue,
	memberFilter,
	memberIdFromFilter,
} from "./assignment_filter";

const UNASSIGNED = "unassigned";

// Deals per owner id, with ownerless deals under "unassigned"
export function countDealsByOwner(owners: Record<string, string | null>) {
	const counts: Record<string, number> = {};
	for (const ownerId of Object.values(owners)) {
		const key = ownerId ?? UNASSIGNED;
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

type Row = PipelineTeamMembers & { count: number };

export default function TeamWorkload({
	value,
	onChange,
	members,
	owners,
}: {
	value: AssignmentFilterValue;
	onChange: (value: AssignmentFilterValue) => void;
	members: PipelineTeamMembers[];
	owners: Record<string, string | null> | undefined;
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const { data: staffs, isError: staffsError } = useGetStaffs();
	const counts = useMemo(() => countDealsByOwner(owners ?? {}), [owners]);
	const selectedId = memberIdFromFilter(value);

	const rows = useMemo<Row[]>(() => {
		// Without roles (e.g. /users is forbidden) fall back to everyone on the board
		const repIds =
			staffs && !staffsError
				? new Set(
						staffs.data
							.filter((s) => s.role === "sales_rep" && s.is_active)
							.map((s) => s._id),
					)
				: null;
		return (
			members
				.map((member) => ({ ...member, count: counts[member.id] ?? 0 }))
				// Keep anyone who owns deals so the counts always add up
				.filter((row) => !repIds || repIds.has(row.id) || row.count > 0)
				.sort(
					(a, b) =>
						b.count - a.count || a.display_name.localeCompare(b.display_name),
				)
		);
	}, [members, counts, staffs, staffsError]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				row.display_name.toLowerCase().includes(q) ||
				row.email.toLowerCase().includes(q),
		);
	}, [rows, query]);

	const selectedName = selectedId
		? (members.find((m) => m.id === selectedId)?.display_name ??
			"Unknown member")
		: null;

	const select = (next: AssignmentFilterValue) => {
		onChange(next);
		setOpen(false);
		setQuery("");
	};

	const rowClass =
		"flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 cursor-pointer";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={`inline-flex max-w-52 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
						selectedName
							? "border-[#00B3A6] bg-[#00B3A6] text-white"
							: "border-[#D9E1E8] bg-white text-foreground/70 hover:bg-gray-100"
					}`}
				>
					<Users size={14} className="shrink-0" />
					<span className="truncate">{selectedName ?? "Team"}</span>
					<ChevronDown size={14} className="shrink-0" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-72 p-0 font-inter">
				<div className="flex items-center justify-between gap-2 border-b border-b-[#E2E8F0] px-3 py-2">
					<span className="text-xs font-medium text-foreground">
						Deals assigned
					</span>
					<span className="text-[10px] text-foreground/50">All stages</span>
				</div>
				<div className="flex items-center gap-2 border-b border-b-[#E2E8F0] px-3 py-2">
					<Search size={14} className="shrink-0 text-foreground/40" />
					<input
						autoFocus
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search team members…"
						className="w-full bg-transparent text-xs outline-none placeholder:text-foreground/40"
					/>
				</div>

				<div className="flex flex-col gap-0.5 p-1 max-h-72 overflow-y-auto">
					{rows.length === 0 ? (
						<span className="px-2 py-3 text-center text-xs text-foreground/50">
							No sales reps yet
						</span>
					) : filtered.length === 0 ? (
						<span className="px-2 py-3 text-center text-xs text-foreground/50">
							No team members found
						</span>
					) : (
						filtered.map((row) => {
							const selected = row.id === selectedId;
							return (
								<button
									key={row.id}
									type="button"
									onClick={() => select(memberFilter(row.id))}
									className={rowClass}
								>
									<div className="flex min-w-0 items-center gap-2">
										<span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00B3A6] text-[10px] font-semibold text-white">
											{getInitials(row.display_name)}
										</span>
										<div className="flex min-w-0 flex-col">
											<span className="text-xs text-foreground truncate">
												{row.display_name}
											</span>
											<span className="text-[10px] text-foreground/50 truncate">
												{row.email}
											</span>
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-1.5">
										<CountBadge count={row.count} />
										{selected && <Check size={14} className="text-[#00B3A6]" />}
									</div>
								</button>
							);
						})
					)}
				</div>

				<div className="p-1 border-t border-t-[#E2E8F0]">
					<button
						type="button"
						onClick={() => select("unassigned")}
						className={rowClass}
					>
						<div className="flex items-center gap-2">
							<span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-foreground/30 text-foreground/50">
								<UserPlus size={12} />
							</span>
							<span className="text-xs text-foreground/70">Unassigned</span>
						</div>
						<div className="flex shrink-0 items-center gap-1.5">
							<CountBadge count={counts[UNASSIGNED] ?? 0} />
							{value === "unassigned" && (
								<Check size={14} className="text-[#00B3A6]" />
							)}
						</div>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

function CountBadge({ count }: { count: number }) {
	return (
		<span
			className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[10px] font-semibold ${
				count > 0
					? "bg-[#E6F7F6] text-[#00877E]"
					: "bg-gray-100 text-foreground/40"
			}`}
		>
			{count}
		</span>
	);
}
