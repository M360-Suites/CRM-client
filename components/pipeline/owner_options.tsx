"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { PipelineTeamMembers } from "@/types/pipeline";

export default function OwnerOptions({
	ownerId,
	members,
	disabled,
	onSelect,
}: {
	ownerId: string | null;
	members: PipelineTeamMembers[];
	disabled?: boolean;
	onSelect: (ownerId: string | null) => void;
}) {
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return [...members]
			.sort((a, b) => a.display_name.localeCompare(b.display_name))
			.filter(
				(member) =>
					!q ||
					member.display_name.toLowerCase().includes(q) ||
					member.email.toLowerCase().includes(q),
			);
	}, [members, query]);

	const select = (id: string | null) => {
		if (disabled || id === ownerId) return;
		onSelect(id);
	};

	const optionClass =
		"flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 cursor-pointer disabled:cursor-default";

	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-2 border-b border-b-[#E2E8F0] px-3 py-2">
				<Search size={14} className="shrink-0 text-foreground/40" />
				<input
					autoFocus
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && filtered.length > 0) {
							e.preventDefault();
							select(filtered[0].id);
						}
					}}
					placeholder="Search team members…"
					className="w-full bg-transparent text-xs outline-none placeholder:text-foreground/40"
				/>
			</div>

			<div className="p-1 border-b border-b-[#E2E8F0]">
				<button
					type="button"
					disabled={disabled || ownerId === null}
					onClick={() => select(null)}
					className={optionClass}
				>
					<span className="text-xs text-foreground/70">Unassigned</span>
					{ownerId === null && <Check size={14} className="text-[#00B3A6]" />}
				</button>
			</div>

			<div className="flex flex-col gap-0.5 p-1 max-h-64 overflow-y-auto">
				{filtered.length === 0 ? (
					<span className="px-2 py-3 text-center text-xs text-foreground/50">
						No team members found
					</span>
				) : (
					filtered.map((member) => {
						const selected = ownerId === member.id;
						return (
							<button
								key={member.id}
								type="button"
								disabled={disabled || selected}
								onClick={() => select(member.id)}
								className={optionClass}
							>
								<div className="flex min-w-0 flex-col">
									<span className="text-xs text-foreground truncate">
										{member.display_name}
									</span>
									<span className="text-[10px] text-foreground/50 truncate">
										{member.email}
									</span>
								</div>
								{selected && (
									<Check size={14} className="shrink-0 text-[#00B3A6]" />
								)}
							</button>
						);
					})
				)}
			</div>
		</div>
	);
}
