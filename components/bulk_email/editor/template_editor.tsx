"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, EllipsisVertical, LoaderCircle, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { useCreateBroadcast } from "@/hooks/bulk_email/broadcasts";
import {
	useDeleteEmailTemplate,
	useDuplicateEmailTemplate,
	useEmailTemplate,
	useTestEmailTemplate,
	useUpdateEmailTemplate,
} from "@/hooks/bulk_email/templates";
import { EmailDesign, EmailTemplate } from "@/types/bulk_email";
import ConfirmationModal from "../confirmation_modal";
import { LoadedDesign, loadDesign } from "../email_editor/design";
import EmailEditor from "../email_editor/email_editor";
import PreviewButton from "../email_editor/preview_dialog";
import { renderDesignHtml } from "../email_editor/render";
import EditorHeader, { SavedStatus, useAutosave } from "./editor_header";
import { EditorPageSkeleton } from "../skeletons";

interface TemplateState {
	name: string;
	subject: string;
	preview_text: string;
	design: EmailDesign;
}

const menuItem =
	"flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer disabled:opacity-60";

function Editor({
	id,
	initial,
	loaded,
}: {
	id: string;
	initial: TemplateState;
	loaded: LoadedDesign;
}) {
	const router = useRouter();
	const updateTemplate = useUpdateEmailTemplate();
	const deleteTemplate = useDeleteEmailTemplate();
	const duplicateTemplate = useDuplicateEmailTemplate();
	const testTemplate = useTestEmailTemplate();
	const createBroadcast = useCreateBroadcast();

	const [template, setTemplate] = useState(initial);
	const [broadcastId, setBroadcastId] = useState<string | null>(null);

	const { saving, failed, flush } = useAutosave(template, (t) =>
		updateTemplate.mutateAsync({
			id,
			payload: {
				name: t.name.trim() || "Untitled template",
				// The API requires a subject; fall back to the name until one is set
				subject: t.subject.trim() || t.name.trim() || "Untitled",
				preview_text: t.preview_text,
				html: renderDesignHtml(t.design),
				design: t.design,
			},
		}),
	);

	const update = (patch: Partial<TemplateState>) =>
		setTemplate((t) => ({ ...t, ...patch }));

	const handleCreateBroadcast = () =>
		createBroadcast.mutate(
			{
				name: template.name,
				template_id: id,
				subject: template.subject,
				preview_text: template.preview_text,
				html: renderDesignHtml(template.design),
				design: template.design,
				audience: { all: true },
			},
			{ onSuccess: (b) => setBroadcastId(b._id) },
		);

	const handleTest = async () => {
		try {
			await flush();
			testTemplate.mutate(id);
		} catch {
			// toasted by the save mutation
		}
	};

	return (
		<div className="w-full flex flex-col gap-8 pt-8 pb-8">
			<EditorHeader
				backHref="/bulk-email/templates"
				title={template.name}
				onTitleChange={(name) => update({ name })}
				right={
					<>
						<CustomPopover
							trigger={
								<button
									aria-label="More options"
									className="p-1 rounded hover:bg-gray-100 cursor-pointer"
								>
									<EllipsisVertical size={16} color="#64748B" />
								</button>
							}
							className="pt-2 flex flex-col gap-1 w-44"
						>
							<button
								onClick={handleTest}
								disabled={testTemplate.isPending}
								className={`${menuItem} text-foreground hover:bg-gray-100`}
							>
								<Mail size={16} />
								Send me a test
							</button>
							<button
								disabled={duplicateTemplate.isPending}
								onClick={async () => {
									try {
										await flush();
										const copy = await duplicateTemplate.mutateAsync(id);
										router.push(`/bulk-email/templates/${copy._id}`);
									} catch {
										// toasted
									}
								}}
								className={`${menuItem} text-foreground hover:bg-gray-100`}
							>
								<Copy size={16} />
								Duplicate
							</button>
							<button
								disabled={deleteTemplate.isPending}
								onClick={() =>
									deleteTemplate.mutate(id, {
										onSuccess: () => {
											toast.success("Template deleted");
											router.push("/bulk-email/templates");
										},
									})
								}
								className={`${menuItem} text-[#DC2626] hover:bg-red-50`}
							>
								<Trash2 size={16} />
								Delete template
							</button>
						</CustomPopover>
						<SavedStatus saving={saving} failed={failed} />
						<PreviewButton
							design={template.design}
							subject={template.subject}
							previewText={template.preview_text}
						/>
						<CustomButton
							onClick={handleCreateBroadcast}
							disabled={createBroadcast.isPending}
							className="rounded-[4px] border-0 px-3.5 min-h-8 py-1.5 text-[13px] font-normal"
						>
							{createBroadcast.isPending && (
								<LoaderCircle size={14} className="animate-spin" />
							)}
							Create a broadcast
						</CustomButton>
					</>
				}
			/>

			<div className="flex flex-col gap-6">
				<div className="grid md:grid-cols-2 gap-3 rounded-md border border-[#E2E8F0] bg-white px-4 py-4">
					<label className="flex flex-col gap-1.5">
						<span className="text-xs text-[#334155]">Subject line</span>
						<input
							value={template.subject}
							placeholder="Thanks for your interest, {{contact.first_name}}"
							onChange={(e) => update({ subject: e.target.value })}
							className="rounded-[4px] border border-[#E2E8F0] px-3 h-9 text-sm text-[#0F172A] outline-none focus:border-[#0091FE]"
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-xs text-[#334155]">Preview text</span>
						<input
							value={template.preview_text}
							placeholder="Shown after the subject in the inbox (optional)"
							onChange={(e) => update({ preview_text: e.target.value })}
							className="rounded-[4px] border border-[#E2E8F0] px-3 h-9 text-sm text-[#0F172A] outline-none focus:border-[#0091FE]"
						/>
					</label>
				</div>
				<EmailEditor initial={loaded} onChange={(design) => update({ design })} />
			</div>

			<ConfirmationModal
				open={broadcastId !== null}
				title="Broadcast created"
				description="Your broadcast is ready. You can now edit the content or send it as is."
				actionLabel="Continue"
				onAction={() => router.push(`/bulk-email/new?id=${broadcastId}`)}
			/>
		</div>
	);
}

const stateFromTemplate = (t: EmailTemplate, loaded: LoadedDesign): TemplateState => ({
	name: t.name ?? "",
	subject: t.subject ?? "",
	preview_text: t.preview_text ?? "",
	design: loaded.design,
});

export default function TemplateEditor({ id }: { id: string }) {
	const { data: template, isLoading, isError } = useEmailTemplate(id);

	if (isLoading) return <EditorPageSkeleton />;

	if (isError || !template) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<span className="text-base text-foreground">
					This template couldn&apos;t be found
				</span>
				<Link
					href="/bulk-email/templates"
					className="text-sm text-[#0091FE] hover:underline"
				>
					Back to templates
				</Link>
			</div>
		);
	}

	const loaded = loadDesign(template);
	// Keyed so navigating between templates resets the editor state
	return (
		<Editor
			key={id}
			id={id}
			loaded={loaded}
			initial={stateFromTemplate(template, loaded)}
		/>
	);
}
