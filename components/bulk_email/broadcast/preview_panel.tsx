"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user/user_store";
import { BulkEmail } from "@/types/bulk_email";
import { AUDIENCE_LABELS } from "../data";

// Inbox-style summary shown above the canvas on the preview step.
export function PreviewHeader({
	email,
	onChange,
}: {
	email: BulkEmail;
	onChange: (patch: Partial<BulkEmail>) => void;
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
				<span>
					Reply-to: <span className="text-[#64748B]">{sender}</span>
				</span>
				<label className="flex items-center gap-1">
					To:
					<select
						value={email.audience}
						onChange={(e) =>
							onChange({ audience: e.target.value as BulkEmail["audience"] })
						}
						className="bg-transparent text-[#64748B] outline-none cursor-pointer"
					>
						{Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</label>
			</div>
		</div>
	);
}

export default function PreviewPanel() {
	const user = useUserStore((s) => s.user);
	const [testEmail, setTestEmail] = useState(user?.email ?? "");

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
			<form
				className="flex flex-col gap-2 px-4 py-5"
				onSubmit={(e) => {
					e.preventDefault();
					if (!/^\S+@\S+\.\S+$/.test(testEmail)) {
						toast.error("Enter a valid email address");
						return;
					}
					// TODO: send through the test email endpoint once it exists
					toast.info("Test emails aren't available yet");
				}}
			>
				<label
					htmlFor="test-email"
					className="text-xs font-semibold tracking-wider text-[#334155]"
				>
					SEND A TEST EMAIL
				</label>
				<input
					id="test-email"
					type="email"
					value={testEmail}
					placeholder="you@company.com"
					onChange={(e) => setTestEmail(e.target.value)}
					className="mt-1 rounded-[4px] border border-[#E2E8F0] px-3 h-8.5 text-xs text-[#0F172A] outline-none focus:border-[#0091FE]"
				/>
				<button
					type="submit"
					className="flex items-center justify-center gap-2 rounded-[4px] border border-[#E2E8F0] h-8.5 text-xs font-medium text-[#0F172A] hover:bg-gray-50 cursor-pointer"
				>
					<Mail size={14} />
					Send test
				</button>
				<p className="mt-2 text-[11px] text-[#64748B] leading-[18px]">
					Test emails will include standard merge tag placeholders and
					deactivated unsubscribe actions.
				</p>
			</form>
		</aside>
	);
}
