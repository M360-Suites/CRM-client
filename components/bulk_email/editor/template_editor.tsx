"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, EllipsisVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomPopover } from "@/components/custom/common/customPopover";
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import { EmailContent, EmailTemplate } from "@/types/bulk_email";
import ConfirmationModal from "../confirmation_modal";
import EmailCanvas from "./email_canvas";
import EditorHeader, { SavedStatus, useAutosave } from "./editor_header";
import FormatToolbar from "./format_toolbar";
import { ImageInspector, StylesInspector } from "./inspector";

function Editor({ initial }: { initial: EmailTemplate }) {
	const router = useRouter();
	const { saveTemplate, deleteTemplate, saveEmail } = useBulkEmailStore();
	const [template, setTemplate] = useState(initial);
	const [panel, setPanel] = useState<"styles" | "image">("styles");
	const [broadcastId, setBroadcastId] = useState<string | null>(null);

	// TODO: persist through the templates endpoint once it exists
	const saving = useAutosave(template, (t) =>
		saveTemplate({ ...t, updated_at: new Date().toISOString() }),
	);

	const updateContent = (patch: Partial<EmailContent>) =>
		setTemplate((t) => ({ ...t, content: { ...t.content, ...patch } }));

	const createBroadcast = () => {
		const _id = crypto.randomUUID();
		saveEmail({
			_id,
			title: template.name,
			subject: "",
			preview_text: "",
			audience: "all",
			status: "draft",
			template_id: template._id,
			ab_test: false,
			content: structuredClone(template.content),
			updated_at: new Date().toISOString(),
			updated_by: "You",
		});
		setBroadcastId(_id);
	};

	return (
		<div className="w-full flex flex-col gap-4 pt-8 pb-8">
			<EditorHeader
				backHref="/bulk-email/templates"
				title={template.name}
				onTitleChange={(name) => setTemplate((t) => ({ ...t, name }))}
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
							className="pt-2 flex flex-col gap-1 w-40"
						>
							<button
								onClick={() => {
									const _id = crypto.randomUUID();
									saveTemplate({
										...structuredClone(template),
										_id,
										name: `${template.name} (copy)`,
									});
									router.push(`/bulk-email/templates/${_id}`);
								}}
								className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-foreground hover:bg-gray-100 cursor-pointer"
							>
								<Copy size={16} />
								Duplicate
							</button>
							<button
								onClick={() => {
									deleteTemplate(template._id);
									toast.success("Template deleted");
									router.push("/bulk-email/templates");
								}}
								className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#DC2626] hover:bg-red-50 cursor-pointer"
							>
								<Trash2 size={16} />
								Delete template
							</button>
						</CustomPopover>
						<SavedStatus saving={saving} />
						<CustomButton
							onClick={createBroadcast}
							className="rounded-md px-4 py-1.5 min-h-8 text-sm"
						>
							Create a broadcast
						</CustomButton>
					</>
				}
			/>

			<div className="flex max-lg:flex-col gap-4 items-start">
				<div className="flex-1 min-w-0 w-full flex flex-col gap-4">
					<FormatToolbar className="sticky top-20 z-10 mx-auto w-fit max-w-full rounded-lg border border-[#E2E8F0] bg-white px-2 py-1 shadow-sm" />
					<EmailCanvas
						editable
						content={template.content}
						imageSelected={panel === "image"}
						onSelectImage={() => setPanel("image")}
						onSelectText={() => setPanel("styles")}
						onHtmlChange={(html) => updateContent({ html })}
					/>
				</div>

				<aside className="lg:w-72 w-full shrink-0 bg-white border border-[#E2E8F0] rounded-md lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] overflow-y-auto">
					{panel === "image" ? (
						<ImageInspector
							image={template.content.image}
							onBack={() => setPanel("styles")}
							onChange={(patch) =>
								updateContent({
									image: { ...template.content.image, ...patch },
								})
							}
						/>
					) : (
						<StylesInspector
							content={template.content}
							onChange={updateContent}
						/>
					)}
				</aside>
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

export default function TemplateEditor({ id }: { id: string }) {
	const template = useBulkEmailStore((s) =>
		s.templates.find((t) => t._id === id),
	);

	if (!template) {
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

	// Keyed so navigating between templates resets the editor state
	return <Editor key={id} initial={template} />;
}
