"use client";

import { Loader } from "lucide-react";
import {
	useGetAssignmentMode,
	useUpdateAssignmentMode,
} from "@/hooks/org/assignment_settings";
import { useCanChangeAssignmentMode } from "@/hooks/user/permissions";

export default function AutoAssignSwitch() {
	const { data: mode, isPending: isLoading, isError } = useGetAssignmentMode();
	const { mutate: updateMode, isPending: isUpdating } =
		useUpdateAssignmentMode();
	const canChange = useCanChangeAssignmentMode();
	const enabled = mode === "auto";

	const description = isError
		? "Couldn't load the assignment setting."
		: enabled
			? "New leads are routed by your rules, then to the least-loaded rep."
			: "New leads arrive unassigned until a manager assigns them.";

	return (
		<div className="flex items-center gap-3 rounded-[10px] border border-[#D9E1E8] bg-white px-4 py-2.5">
			<div className="flex flex-col">
				<span className="text-sm font-medium text-foreground">
					Auto-assign leads
				</span>
				<span className="text-xs text-foreground/50">{description}</span>
			</div>
			{isLoading ? (
				<Loader size={16} className="animate-spin shrink-0" />
			) : (
				<button
					type="button"
					role="switch"
					aria-checked={enabled}
					aria-label="Auto-assign leads"
					title={canChange ? undefined : "Only admins can change this"}
					disabled={!canChange || isUpdating || isError}
					onClick={() => updateMode(enabled ? "manual" : "auto")}
					className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
						enabled ? "bg-[#00B3A6]" : "bg-foreground/20"
					}`}
				>
					<span
						className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
							enabled ? "translate-x-4.5" : "translate-x-0.5"
						}`}
					/>
				</button>
			)}
		</div>
	);
}
