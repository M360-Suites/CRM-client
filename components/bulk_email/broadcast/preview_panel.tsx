"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user/user_store";

export default function PreviewPanel() {
	const user = useUserStore((s) => s.user);
	const [testEmail, setTestEmail] = useState(user?.email ?? "");

	return (
		<aside className="lg:w-96 w-full shrink-0 rounded-md border border-[#E2E8F0] bg-white lg:sticky lg:top-20">
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
					className="text-[11px] font-semibold tracking-wider text-[#64748B]"
				>
					SEND A TEST EMAIL
				</label>
				<input
					id="test-email"
					type="email"
					value={testEmail}
					placeholder="you@company.com"
					onChange={(e) => setTestEmail(e.target.value)}
					className="rounded-md border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] outline-none focus:border-[#0091FE]"
				/>
				<button
					type="submit"
					className="flex items-center justify-center gap-2 rounded-md border border-[#E2E8F0] py-2 text-sm text-[#0F172A] hover:bg-gray-50 cursor-pointer"
				>
					<Send size={14} />
					Send test
				</button>
				<p className="text-[11px] text-[#94A3B8] leading-4">
					Test emails will include standard merge tag placeholders and
					deactivated unsubscribe actions.
				</p>
			</form>
		</aside>
	);
}
