"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	EllipsisVertical,
	Eye,
	FlaskConical,
	Maximize2,
	Minimize2,
	Sparkles,
	Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import { useUserStore } from "@/stores/user/user_store";
import { BulkEmail, EmailContent } from "@/types/bulk_email";
import { AUDIENCE_LABELS, createDefaultContent } from "../data";
import ConfirmationModal from "../confirmation_modal";
import EmailCanvas from "../editor/email_canvas";
import EditorHeader, {
	SavedStatus,
	useAutosave,
} from "../editor/editor_header";
import FormatToolbar from "../editor/format_toolbar";
import { ColorField, Toggle } from "../editor/controls";
import PreviewPanel from "./preview_panel";

function Stepper({ step }: { step: "edit" | "preview" }) {
	return (
		<div className="flex items-center gap-3 text-xs">
			<span className="flex items-center gap-1.5 text-[#0F172A] font-medium">
				<span className="h-2 w-2 rounded-full bg-[#0091FE]" />
				Draft
			</span>
			<span className="h-px w-3 bg-[#CBD5E1]" />
			<span
				className={`flex items-center gap-1.5 ${step === "preview" ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}`}
			>
				<span
					className={`h-2 w-2 rounded-full border ${step === "preview" ? "bg-[#0091FE] border-[#0091FE]" : "border-[#94A3B8]"}`}
				/>
				Publish
			</span>
		</div>
	);
}

function TemplateSection({
	templateName,
	onApply,
	onSave,
}: {
	templateName: string;
	onApply: (content: EmailContent, templateId: string) => void;
	onSave: () => void;
}) {
	const { templates } = useBulkEmailStore();

	return (
		<div className="flex flex-col gap-2">
			<span className="flex items-center gap-1.5 text-xs font-medium text-[#0F172A]">
				Template
				<span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
			</span>
			<div className="flex gap-3 rounded-md border border-[#E2E8F0] p-3">
				<div className="w-11 h-14 shrink-0 rounded-sm bg-[#F1F5F9] flex flex-col gap-1 p-1.5">
					<span className="h-3 w-full rounded-[2px] bg-[#CBD5E1]" />
					<span className="h-1 w-3/4 rounded-full bg-[#CBD5E1]" />
					<span className="h-1 w-full rounded-full bg-[#CBD5E1]" />
					<span className="h-1 w-1/2 rounded-full bg-[#CBD5E1]" />
				</div>
				<div className="flex flex-col gap-1.5 flex-1 min-w-0">
					<span className="text-xs text-[#0F172A] truncate">
						{templateName}
					</span>
					<CustomPopover
						align="start"
						title="Templates"
						popoverClassname="max-h-72 overflow-y-auto"
						className="pt-2 flex flex-col w-56"
						trigger={
							<button className="rounded-md border border-[#E2E8F0] py-1 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer">
								Browse templates
							</button>
						}
					>
						{templates.length === 0 && (
							<span className="px-2 py-1.5 text-xs text-[#64748B]">
								No saved templates yet
							</span>
						)}
						{templates.map((t) => (
							<button
								key={t._id}
								onClick={() =>
									onApply(structuredClone(t.content), t._id)
								}
								className="text-left px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-gray-100 cursor-pointer"
							>
								{t.name}
							</button>
						))}
					</CustomPopover>
					<button
						onClick={onSave}
						className="rounded-md border border-[#E2E8F0] py-1 text-xs text-[#0F172A] hover:bg-gray-50 cursor-pointer"
					>
						Save template
					</button>
				</div>
			</div>
		</div>
	);
}

function Editor({ initial }: { initial: BulkEmail }) {
	const router = useRouter();
	const { templates, saveEmail, deleteEmail, saveTemplate } =
		useBulkEmailStore();
	const [email, setEmail] = useState(initial);
	const [step, setStep] = useState<"edit" | "preview">("edit");
	const [expanded, setExpanded] = useState(false);
	const [showPreviewText, setShowPreviewText] = useState(
		initial.preview_text !== "",
	);
	const [sent, setSent] = useState(false);

	// TODO: persist through the bulk email endpoint once it exists
	const saving = useAutosave(email, (e) =>
		saveEmail({ ...e, updated_at: new Date().toISOString() }),
	);

	const update = (patch: Partial<BulkEmail>) =>
		setEmail((e) => ({ ...e, ...patch }));
	const updateContent = (patch: Partial<EmailContent>) =>
		setEmail((e) => ({ ...e, content: { ...e.content, ...patch } }));

	const templateName =
		templates.find((t) => t._id === email.template_id)?.name ?? "Default";

	const handleContinue = () => {
		if (step === "edit") {
			if (!email.subject.trim()) {
				toast.error("Add a subject line before continuing");
				return;
			}
			setStep("preview");
			return;
		}
		// TODO: send through the bulk email endpoint once it exists
		const published = {
			...email,
			status: "published" as const,
			updated_at: new Date().toISOString(),
		};
		setEmail(published);
		saveEmail(published);
		setSent(true);
	};

	return (
		<div className="w-full flex flex-col gap-6 pt-8 pb-24">
			<EditorHeader
				backHref="/bulk-email"
				title={email.title}
				onTitleChange={(title) => update({ title })}
				right={
					<>
						<Stepper step={step} />
						<CustomPopover
							trigger={
								<button
									aria-label="More actions"
									className="p-1 rounded hover:bg-gray-100 cursor-pointer"
								>
									<EllipsisVertical size={16} color="#64748B" />
								</button>
							}
							className="pt-2 flex flex-col w-40"
						>
							<button
								onClick={() => {
									deleteEmail(email._id);
									toast.success("Draft deleted");
									router.push("/bulk-email");
								}}
								className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#DC2626] hover:bg-red-50 cursor-pointer"
							>
								<Trash2 size={16} />
								Delete draft
							</button>
						</CustomPopover>
					</>
				}
			/>

			<div className="flex max-lg:flex-col gap-6 items-start justify-center">
				<div
					className={`flex flex-col gap-4 w-full min-w-0 ${expanded ? "max-w-none flex-1" : "max-w-[720px]"}`}
				>
					{step === "edit" ? (
						<>
							<div className="flex flex-col gap-2 rounded-md border border-[#E2E8F0] bg-white p-4">
								<label
									htmlFor="subject"
									className="text-xs font-medium text-[#334155]"
								>
									Subject Line
								</label>
								<div className="flex items-center gap-2 rounded-md border border-[#E2E8F0] px-3 py-2 focus-within:border-[#0091FE]">
									<input
										id="subject"
										value={email.subject}
										placeholder="New Broadcast"
										onChange={(e) => update({ subject: e.target.value })}
										className="flex-1 min-w-0 text-sm text-[#0F172A] outline-none bg-transparent"
									/>
									<button
										title="Suggest a subject line with AI"
										aria-label="Suggest a subject line with AI"
										onClick={() =>
											// TODO: wire to the AI writer endpoint
											toast.info("AI subject suggestions aren't available yet")
										}
										className="text-[#64748B] hover:text-[#0091FE] cursor-pointer"
									>
										<Sparkles size={16} />
									</button>
									<button
										title="Run an A/B test"
										aria-label="Run an A/B test"
										aria-pressed={email.ab_test}
										onClick={() => update({ ab_test: !email.ab_test })}
										className={`cursor-pointer ${email.ab_test ? "text-[#0091FE]" : "text-[#64748B] hover:text-[#0091FE]"}`}
									>
										<FlaskConical size={16} />
									</button>
								</div>
								{showPreviewText ? (
									<input
										aria-label="Preview text"
										value={email.preview_text}
										placeholder="Preview text shown after the subject in the inbox"
										onChange={(e) =>
											update({ preview_text: e.target.value })
										}
										className="rounded-md border border-[#E2E8F0] px-3 py-2 text-xs text-[#0F172A] outline-none focus:border-[#0091FE]"
									/>
								) : (
									<button
										onClick={() => setShowPreviewText(true)}
										className="w-fit text-xs text-[#0091FE] hover:underline cursor-pointer"
									>
										+ Add preview text
									</button>
								)}
							</div>

							<FormatToolbar
								className="sticky top-20 z-10 rounded-md border border-[#E2E8F0] bg-white px-2 py-1"
								right={
									<div className="flex items-center gap-1 shrink-0">
										<button
											title="Preview"
											aria-label="Preview"
											onClick={handleContinue}
											className="h-6 w-6 flex items-center justify-center rounded text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
										>
											<Eye size={14} />
										</button>
										<button
											title={expanded ? "Collapse" : "Expand"}
											aria-label={expanded ? "Collapse" : "Expand"}
											onClick={() => setExpanded((x) => !x)}
											className="h-6 w-6 flex items-center justify-center rounded text-[#334155] hover:bg-[#F1F5F9] cursor-pointer"
										>
											{expanded ? (
												<Minimize2 size={14} />
											) : (
												<Maximize2 size={14} />
											)}
										</button>
									</div>
								}
							/>
						</>
					) : (
						<PreviewHeader email={email} onChange={update} />
					)}

					<EmailCanvas
						size="md"
						editable={step === "edit"}
						content={email.content}
						onHtmlChange={(html) => updateContent({ html })}
					/>
				</div>

				{step === "edit" && !expanded && (
					<aside className="lg:w-70 w-full shrink-0 flex flex-col gap-5 rounded-md border border-[#E2E8F0] bg-white p-4 lg:sticky lg:top-20">
						<h3 className="text-xs font-semibold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
							Email
						</h3>
						<TemplateSection
							templateName={templateName}
							onApply={(content, template_id) =>
								update({ content, template_id })
							}
							onSave={() => {
								// TODO: save through the templates endpoint once it exists
								const _id = crypto.randomUUID();
								saveTemplate({
									_id,
									name: email.title || "Untitled template",
									description: email.subject,
									category: "starting",
									content: structuredClone(email.content),
									updated_at: new Date().toISOString(),
								});
								update({ template_id: _id });
								toast.success("Saved as a template");
							}}
						/>
						<ColorField
							label="Background color"
							value={email.content.background_color}
							onChange={(background_color) =>
								updateContent({ background_color })
							}
						/>
						<Toggle
							label="Run an A/B Test"
							checked={email.ab_test}
							onChange={(ab_test) => update({ ab_test })}
						/>
					</aside>
				)}

				{step === "preview" && <PreviewPanel />}
			</div>

			<div className="fixed bottom-0 right-0 z-20 flex items-center gap-4 rounded-tl-lg border-t border-l border-[#E2E8F0] bg-white px-6 py-3">
				{step === "preview" && (
					<button
						onClick={() => setStep("edit")}
						className="text-sm text-[#334155] hover:underline cursor-pointer"
					>
						Back to edit
					</button>
				)}
				<SavedStatus saving={saving} />
				<CustomButton
					onClick={handleContinue}
					className="rounded-md px-5 py-1.5 min-h-8 text-sm"
				>
					{step === "edit" ? "Continue" : "Send"}
				</CustomButton>
			</div>

			<ConfirmationModal
				open={sent}
				title="Mail Sent"
				description="Your mail is successfully sent"
				actionLabel="Done"
				onAction={() => router.push("/bulk-email")}
			/>
		</div>
	);
}

function PreviewHeader({
	email,
	onChange,
}: {
	email: BulkEmail;
	onChange: (patch: Partial<BulkEmail>) => void;
}) {
	const user = useUserStore((s) => s.user);

	return (
		<div className="flex flex-col gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 py-3 text-xs">
			<div className="flex items-center">
				<span className="w-20 text-[#64748B]">Subject</span>
				<span className="text-sm font-medium text-[#0F172A]">
					{email.subject}
				</span>
			</div>
			<div className="flex items-center">
				<span className="w-20 text-[#64748B]">From</span>
				<span className="text-[#0F172A] truncate">
					{user
						? `${user.display_name} <${user.email}>`
						: "Your connected inbox"}
				</span>
			</div>
			<div className="flex items-center justify-between gap-4 border-t border-[#F1F5F9] pt-2">
				<label className="flex items-center">
					<span className="w-20 text-[#64748B]">To</span>
					<select
						value={email.audience}
						onChange={(e) =>
							onChange({ audience: e.target.value as BulkEmail["audience"] })
						}
						className="rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-xs text-[#0F172A] outline-none cursor-pointer"
					>
						{Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</label>
				<span className="text-[#64748B] truncate">
					{email.preview_text || "No preview text"}
				</span>
			</div>
		</div>
	);
}

export default function BroadcastEditor({
	id,
	templateId,
}: {
	id?: string;
	templateId?: string;
}) {
	const existing = useBulkEmailStore((s) =>
		id ? s.emails.find((e) => e._id === id) : undefined,
	);
	const template = useBulkEmailStore((s) =>
		templateId ? s.templates.find((t) => t._id === templateId) : undefined,
	);

	// Fresh draft, seeded from the chosen template when there is one
	const [draft] = useState<BulkEmail>(() => ({
		_id: crypto.randomUUID(),
		title: "New Broadcast",
		subject: "",
		preview_text: "",
		audience: "all",
		status: "draft",
		template_id: template?._id ?? null,
		ab_test: false,
		content: template
			? structuredClone(template.content)
			: createDefaultContent(),
		updated_at: new Date().toISOString(),
		updated_by: "You",
	}));

	const initial = existing ?? draft;
	return <Editor key={initial._id} initial={initial} />;
}
