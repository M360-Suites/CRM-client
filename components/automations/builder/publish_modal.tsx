"use client";

import { useState } from "react";
import Link from "next/link";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/custom/common/customButton";
import { AUDIENCES } from "../data";

export default function PublishModal({
	open,
	onOpenChange,
	audience,
	sendAt,
	onPublish,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	audience: string;
	sendAt: string | null;
	onPublish: (audience: string, sendAt: string | null) => void;
}) {
	const [group, setGroup] = useState(audience);
	const [scheduling, setScheduling] = useState(sendAt !== null);
	const [when, setWhen] = useState(sendAt ?? "");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[620px] p-10 gap-0 rounded-xl ring-0 border border-[#E3E4E8]/90">
				<DialogTitle className="text-center text-xl font-bold text-[#1E2024]">
					Publish Workflow
				</DialogTitle>
				<DialogDescription className="mt-2 text-center text-[13px] text-[#626771]">
					Choose where you would like to publish this workflow to
				</DialogDescription>

				<div className="mt-8 flex flex-col gap-5 rounded-lg border border-[#E3E4E8] p-5">
					<div className="flex flex-col gap-4 rounded-lg border border-[#F1F5F9] bg-[#F7F8F9] p-4">
						<p className="text-[12.5px] leading-5 text-[#626771]">
							Choose which contacts enter this workflow. You can send yourself
							a test email or add contacts before publishing.
						</p>
						<div className="flex gap-2">
							<select
								aria-label="Contacts"
								value={group}
								onChange={(e) => setGroup(e.target.value)}
								className="flex-1 min-w-0 h-9 rounded-md border border-[#E3E4E8] bg-white px-3 text-[12.5px] text-[#626771] outline-none cursor-pointer"
							>
								{AUDIENCES.map((a) => (
									<option key={a}>{a}</option>
								))}
							</select>
							<Link
								href="/contacts"
								className="h-9 flex items-center rounded-md bg-[#EBECEF] px-4 text-[12.5px] font-bold text-[#1E2024] hover:bg-[#E2E4E8]"
							>
								Add contacts
							</Link>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className="text-xs text-[#626771]">
							When would you like to send this?
						</span>
						<div className="flex items-center justify-between gap-3 h-10 rounded-lg border border-[#E3E4E8] px-4">
							{scheduling ? (
								<input
									type="datetime-local"
									aria-label="Send at"
									value={when}
									onChange={(e) => setWhen(e.target.value)}
									className="flex-1 min-w-0 text-[13px] text-[#1E2024] outline-none"
								/>
							) : (
								<span className="text-[13px] text-[#1E2024]">Now</span>
							)}
							<button
								type="button"
								onClick={() => setScheduling((s) => !s)}
								className="text-[13px] text-[#2563EB] hover:underline cursor-pointer"
							>
								{scheduling ? "Send now" : "Schedule"}
							</button>
						</div>
					</div>
				</div>

				<CustomButton
					onClick={() => onPublish(group, scheduling && when ? when : null)}
					disabled={scheduling && !when}
					className="mt-6 w-full rounded-lg border-0 min-h-10 text-[13px] font-normal"
				>
					{scheduling ? "Schedule workflow" : "Publish workflow"}
				</CustomButton>
			</DialogContent>
		</Dialog>
	);
}
