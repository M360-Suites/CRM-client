"use client";

export type AssignmentFilterValue = "all" | "mine" | "unassigned";

const OPTIONS: { value: AssignmentFilterValue; label: string }[] = [
	{ value: "all", label: "All deals" },
	{ value: "mine", label: "My deals" },
	{ value: "unassigned", label: "Unassigned" },
];

export default function AssignmentFilter({
	value,
	onChange,
}: {
	value: AssignmentFilterValue;
	onChange: (value: AssignmentFilterValue) => void;
}) {
	return (
		<div className="inline-flex items-center gap-1 rounded-full border border-[#D9E1E8] bg-white p-1">
			{OPTIONS.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
						value === option.value
							? "bg-[#00B3A6] text-white"
							: "text-foreground/70 hover:bg-gray-100"
					}`}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}
