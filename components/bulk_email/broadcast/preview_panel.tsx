"use client";

import { useState } from "react";
import { CalendarClock, LoaderCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user/user_store";
import { BroadcastAudience } from "@/types/bulk_email";
import { audienceSummary } from "../data";
import { Toggle } from "../email_editor/controls";
import RecipientsCard from "./recipients_card";

export interface BroadcastDraft {
	name: string;
	subject: string;
	preview_text: string;
	audience: BroadcastAudience;
	template_id: string | null;
}

// Inbox-style summary shown above the canvas on the preview step.
export function PreviewHeader({
	email,
	onEditRecipients,
}: {
	email: BroadcastDraft;
	// Opens the Add Contacts modal in the send panel
	onEditRecipients: () => void;
}) {
	const user = useUserStore((s) => s.user);
	const sender = user?.email ?? "Your connected inbox";

	return (
		<div className="flex flex-col gap-2 bg-[#F8FAFC] px-4 pt-4 pb-3">
			<div className="flex items-center gap-5">
				<span className="w-16 text-[11px] font-semibold tracking-wider text-[#64748B]">
					SUBJECT:
				</span>
				<span className="text-sm font-semibold text-[#0F172A] truncate">
					{email.subject}
				</span>
			</div>
			<div className="flex items-center gap-5">
				<span className="w-16 text-[11px] text-[#64748B]">Preview:</span>
				<span className="text-xs italic text-[#334155] truncate">
					{email.preview_text || "No preview text"}
				</span>
			</div>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#E2E8F0] pt-2 text-[11px] text-[#94A3B8]">
				<span>
					From: <span className="text-[#64748B]">{sender}</span>
				</span>
				<span className="flex items-center gap-1">
					To: <span className="text-[#64748B]">{audienceSummary(email.audience).label}</span>
					<button
						type="button"
						onClick={onEditRecipients}
						className="ml-1 text-[#0091FE] hover:underline cursor-pointer"
					>
						Change
					</button>
				</span>
			</div>
		</div>
	);
}

// Local "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
export const toLocalInput = (date: Date) => {
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export default function PreviewPanel({
	audience,
	onAudienceChange,
	pickerOpen,
	setPickerOpen,
	schedule,
	scheduledAt,
	onScheduleChange,
	onScheduledAtChange,
	onSendTest,
	testing,
}: {
	audience: BroadcastAudience;
	onAudienceChange: (audience: BroadcastAudience) => void;
	pickerOpen: boolean;
	setPickerOpen: (open: boolean) => void;
	schedule: boolean;
	scheduledAt: string;
	onScheduleChange: (schedule: boolean) => void;
	onScheduledAtChange: (value: string) => void;
	// Empty list sends to the signed-in user
	onSendTest: (to: string[]) => void;
	testing: boolean;
}) {
	const user = useUserStore((s) => s.user);
	const [testTo, setTestTo] = useState("");

	const sendTest = () => {
		const to = testTo
			.split(/[\s,;]+/)
			.map((e) => e.trim())
			.filter(Boolean);
		if (to.length > 5) {
			toast.error("Send a test to 5 people at most");
			return;
		}
		const invalid = to.find((e) => !/^\S+@\S+\.\S+$/.test(e));
		if (invalid) {
			toast.error(`${invalid} isn't a valid email address`);
			return;
		}
		onSendTest(to);
	};

	return (
		<aside className="lg:w-96 w-full shrink-0 self-stretch bg-white">
			<div className="flex flex-col gap-1 border-b border-[#F1F5F9] px-4 py-4">
				<h2 className="text-sm font-semibold text-[#0F172A]">
					Preview &amp; Test Email
				</h2>
				<p className="text-xs text-[#64748B]">
					Send a test copy or verify deliverability details before
					publishing.
				</p>
			</div>

			<RecipientsCard
				audience={audience}
				onChange={onAudienceChange}
				open={pickerOpen}
				setOpen={setPickerOpen}
			/>

			<div className="flex flex-col gap-3 border-b border-[#F1F5F9] px-4 py-5">
				<Toggle
					label="Schedule for later"
					checked={schedule}
					onChange={onScheduleChange}
				/>
				{schedule && (
					<label className="flex items-center gap-2 rounded-[4px] border border-[#E2E8F0] px-3 h-8.5 focus-within:border-[#0091FE]">
						<CalendarClock size={14} color="#64748B" />
						<input
							type="datetime-local"
							aria-label="Send at"
							value={scheduledAt}
							min={toLocalInput(new Date())}
							onChange={(e) => onScheduledAtChange(e.target.value)}
							className="flex-1 text-xs text-[#0F172A] outline-none bg-transparent"
						/>
					</label>
				)}
			</div>

			<div className="flex flex-col gap-2 px-4 py-5">
				<span className="text-xs font-semibold tracking-wider text-[#334155]">
					SEND A TEST EMAIL
				</span>
				<p className="text-[11px] text-[#64748B] leading-[18px]">
					Goes to{" "}
					<span className="text-[#0F172A]">{user?.email ?? "you"}</span>{" "}
					with sample merge data, or to up to 5 teammates listed below.
				</p>
				<input
					aria-label="Teammates to send the test to"
					value={testTo}
					onChange={(e) => setTestTo(e.target.value)}
					placeholder="teammate@company.com, another@company.com"
					className="rounded-[4px] border border-[#E2E8F0] px-3 h-8.5 text-xs text-[#0F172A] outline-none focus:border-[#0091FE]"
				/>
				<button
					type="button"
					onClick={sendTest}
					disabled={testing}
					className="flex items-center justify-center gap-2 rounded-[4px] border border-[#E2E8F0] h-8.5 text-xs font-medium text-[#0F172A] hover:bg-gray-50 cursor-pointer disabled:opacity-60"
				>
					{testing ? (
						<LoaderCircle size={14} className="animate-spin" />
					) : (
						<Mail size={14} />
					)}
					Send test
				</button>
			</div>
		</aside>
	);
}
