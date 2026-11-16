"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
	ChevronRight,
	EllipsisVertical,
	LoaderCircle,
	Plus,
	Trash2,
	Zap,
} from "lucide-react";
import { toast } from "sonner";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomPopover } from "@/components/custom/common/customPopover";
import {
	useBroadcast,
	useCreateBroadcast,
	useDeleteBroadcast,
	useSendBroadcast,
	useTestBroadcast,
	useUpdateBroadcast,
} from "@/hooks/bulk_email/broadcasts";
import {
	useCreateEmailTemplate,
	useEmailTemplate,
	useEmailTemplates,
} from "@/hooks/bulk_email/templates";
import { GetEmailTemplate } from "@/services/bulk_email/templates";
import { Broadcast, BroadcastPayload, EmailDesign } from "@/types/bulk_email";
import { EDITABLE_STATUSES, isAllContacts } from "../data";
import ConfirmationModal from "../confirmation_modal";
import EditorHeader, {
	SavedStatus,
	useAutosave,
} from "../editor/editor_header";
import {
	DEFAULT_TEMPLATE_NAME,
	LoadedDesign,
	createDefaultDesign,
	loadDesign,
} from "../email_editor/design";
import EmailEditor from "../email_editor/email_editor";
import PreviewButton from "../email_editor/preview_dialog";
import { renderDesignHtml, renderPreviewHtml } from "../email_editor/render";
import PreviewPanel, {
	BroadcastDraft,
	PreviewHeader,
	toLocalInput,
} from "./preview_panel";
import { EditorPageSkeleton, MenuItemsSkeleton } from "../skeletons";

interface EditorState {
	draft: BroadcastDraft;
	design: EmailDesign;
}

const toPayload = ({ draft, design }: EditorState): BroadcastPayload => ({
	name: draft.name.trim() || "Untitled broadcast",
	subject: draft.subject,
	preview_text: draft.preview_text,
	audience: draft.audience,
	html: renderDesignHtml(design),
	design,
	...(draft.template_id ? { template_id: draft.template_id } : {}),
});

function Stepper({ step }: { step: "edit" | "preview" }) {
	const published = step === "preview";
	return (
		<div className="flex items-center gap-2 text-xs">
			<span className="flex items-center gap-1.5 text-[#334155]">
				<span className="h-1.5 w-1.5 rounded-full bg-[#0F172A]" />
				Draft
			</span>
			<ChevronRight size={12} color="#94A3B8" />
			<span
				className={`flex items-center gap-1.5 ${published ? "text-[#334155]" : "text-[#94A3B8]"}`}
			>
				<span
					className={`h-1.5 w-1.5 rounded-full border ${published ? "bg-[#0F172A] border-[#0F172A]" : "border-[#94A3B8]"}`}
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
	saving,
}: {
	templateName: string;
	onApply: (templateId: string) => void;
	onSave: () => void;
	saving: boolean;
}) {
	const { data, isLoading } = useEmailTemplates({ limit: 50 });
	const templates = data?.data ?? [];

	return (
		<div className="flex flex-col gap-2">
			<span className="flex items-center gap-1.5 text-xs text-[#334155]">
				Template
				<span className="h-1.5 w-1.5 rounded-full bg-[#F97316]" />
			</span>
			<div className="flex gap-3 rounded-md border border-[#E2E8F0] p-2.5">
				<div className="w-11 h-14 shrink-0 rounded-[3px] border border-[#E2E8F0] bg-white flex flex-col gap-1 p-1.5">
					<span className="h-3 w-full rounded-[1px] bg-[#BAE6FD]" />
					<span className="h-0.5 w-3/4 rounded-full bg-[#E2E8F0]" />
					<span className="h-0.5 w-full rounded-full bg-[#E2E8F0]" />
					<span className="mt-0.5 h-1 w-1/2 rounded-full bg-[#14B8A6]" />
				</div>
				<div className="flex flex-col gap-1.5 flex-1 min-w-0">
					<span className="text-xs font-semibold text-[#0F172A] truncate">
						{templateName}
					</span>
					<CustomPopover
						align="start"
						title="Templates"
						popoverClassname="max-h-72 overflow-y-auto"
						className="pt-2 flex flex-col w-56"
						trigger={
							<button className="rounded-[4px] border border-[#E2E8F0] py-1 text-[11px] text-[#334155] hover:bg-gray-50 cursor-pointer">
								Browse templates
							</button>
						}
					>
						{isLoading && <MenuItemsSkeleton />}
						{!isLoading && templates.length === 0 && (
							<span className="px-2 py-1.5 text-xs text-[#64748B]">
								No saved templates yet
							</span>
						)}
						{templates.map((t) => (
							<button
								key={t._id}
								onClick={() => onApply(t._id)}
								className="text-left px-2 py-1.5 rounded-md text-xs text-foreground hover:bg-gray-100 cursor-pointer"
							>
								{t.name}
							</button>
						))}
					</CustomPopover>
					<button
						onClick={onSave}
						disabled={saving}
						className="rounded-[4px] border border-[#E2E8F0] py-1 text-[11px] text-[#334155] hover:bg-gray-50 cursor-pointer disabled:opacity-60"
					>
						{saving ? "Saving…" : "Save template"}
					</button>
				</div>
			</div>
		</div>
	);
}

function Editor({
	initial,
	loaded: initialLoaded,
	initialId,
	initialTemplateName,
	scheduledAt: initialScheduledAt,
}: {
	initial: EditorState;
	loaded: LoadedDesign;
	initialId: string | null;
	initialTemplateName?: string;
	// Set when editing a scheduled broadcast (only drafts can be deleted)
	scheduledAt?: string | null;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const createBroadcast = useCreateBroadcast();
	const updateBroadcast = useUpdateBroadcast();
	const deleteBroadcast = useDeleteBroadcast();
	const sendBroadcast = useSendBroadcast();
	const testBroadcast = useTestBroadcast();
	const createTemplate = useCreateEmailTemplate();

	const [state, setState] = useState(initial);
	const [templateName, setTemplateName] = useState(
		initialTemplateName ?? DEFAULT_TEMPLATE_NAME,
	);
	const [step, setStep] = useState<"edit" | "preview">("edit");
	// Applying a template swaps the whole design, so the editor remounts with it
	const [loaded, setLoaded] = useState(initialLoaded);
	const [editorKey, setEditorKey] = useState(0);
	const [showPreviewText, setShowPreviewText] = useState(
		initial.draft.preview_text !== "",
	);
	const [schedule, setSchedule] = useState(!!initialScheduledAt);
	const [pickerOpen, setPickerOpen] = useState(false);
	const [scheduledAt, setScheduledAt] = useState(
		initialScheduledAt ? toLocalInput(new Date(initialScheduledAt)) : "",
	);
	const [sent, setSent] = useState<"now" | "scheduled" | null>(null);
	const [sending, setSending] = useState(false);

	// A new broadcast is created on its first save; later saves PATCH it
	const idRef = useRef<string | null>(initialId);
	const creating = useRef<Promise<string> | null>(null);

	const ensureId = async (s: EditorState) => {
		if (idRef.current) return idRef.current;
		if (!creating.current) {
			creating.current = createBroadcast
				.mutateAsync(toPayload(s))
				.then((b) => {
					idRef.current = b._id;
					// Shallow URL update so a refresh reopens this draft
					window.history.replaceState(null, "", `/bulk-email/new?id=${b._id}`);
					return b._id;
				})
				.finally(() => {
					creating.current = null;
				});
			await creating.current;
			return idRef.current!;
		}
		return creating.current;
	};

	const save = async (s: EditorState) => {
		const created = !idRef.current;
		const id = await ensureId(s);
		if (!created) await updateBroadcast.mutateAsync({ id, payload: toPayload(s) });
	};

	const { saving, failed, flush } = useAutosave(state, save);

	const update = (patch: Partial<BroadcastDraft>) =>
		setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
	const setDesign = (design: EmailDesign) => setState((s) => ({ ...s, design }));

	// Push pending edits, making sure the broadcast exists server side
	const persist = async () => {
		await flush();
		return ensureId(state);
	};

	const applyTemplate = async (templateId: string) => {
		try {
			const t = await queryClient.fetchQuery({
				queryKey: ["email-template", templateId],
				queryFn: () => GetEmailTemplate(templateId),
			});
			const next = loadDesign(t);
			setState((s) => ({
				draft: {
					...s.draft,
					template_id: t._id,
					subject: s.draft.subject || t.subject || "",
					preview_text: s.draft.preview_text || t.preview_text || "",
				},
				design: next.design,
			}));
			setLoaded(next);
			setEditorKey((k) => k + 1);
			setTemplateName(t.name);
		} catch (err) {
			toast.error((err as Error).message);
		}
	};

	const saveAsTemplate = () => {
		const { draft, design } = state;
		createTemplate.mutate(
			{
				name: draft.name.trim() || "Untitled template",
				subject: draft.subject.trim() || draft.name.trim() || "Untitled",
				preview_text: draft.preview_text,
				html: renderDesignHtml(design),
				design,
			},
			{
				onSuccess: (t) => {
					update({ template_id: t._id });
					setTemplateName(t.name);
					toast.success("Saved as a template");
				},
			},
		);
	};

	const handleContinue = async () => {
		if (step === "edit") {
			if (!state.draft.subject.trim()) {
				toast.error("Add a subject line before continuing");
				return;
			}
			setStep("preview");
			return;
		}

		// An empty pick list must never reach the backend as "everyone"
		if (!isAllContacts(state.draft.audience) && !state.draft.audience.contact_ids?.length) {
			toast.error("Add at least one contact before sending");
			setPickerOpen(true);
			return;
		}

		let scheduledIso: string | undefined;
		if (schedule) {
			const when = scheduledAt ? new Date(scheduledAt) : null;
			if (!when || Number.isNaN(when.getTime()) || when <= new Date()) {
				toast.error("Pick a time in the future to schedule this email");
				return;
			}
			scheduledIso = when.toISOString();
		}

		setSending(true);
		try {
			const id = await persist();
			await sendBroadcast.mutateAsync({ id, scheduled_at: scheduledIso });
			setSent(scheduledIso ? "scheduled" : "now");
		} catch {
			// Errors are toasted by the mutation hooks
		} finally {
			setSending(false);
		}
	};

	const handleTest = async (to: string[]) => {
		try {
			const id = await persist();
			testBroadcast.mutate({ id, to });
		} catch {
			// toasted
		}
	};

	const handleDelete = () => {
		const id = idRef.current;
		if (!id) {
			router.push("/bulk-email");
			return;
		}
		deleteBroadcast.mutate(id, {
			onSuccess: () => {
				toast.success("Draft deleted");
				router.push("/bulk-email");
			},
		});
	};


	return (
		<div className="w-full flex flex-col gap-10 pt-8 pb-24">
			<EditorHeader
				backHref="/bulk-email"
				title={state.draft.name}
				onTitleChange={(name) => update({ name })}
				right={
					<>
						{/* Quick look while editing; Continue opens the full preview step */}
						{step === "edit" && (
							<PreviewButton
								design={state.design}
								subject={state.draft.subject}
								previewText={state.draft.preview_text}
							/>
						)}
						<Stepper step={step} />
						{!initialScheduledAt && (
						<CustomPopover
							trigger={
								<button
									aria-label="More actions"
									className="p-1 rounded hover:bg-gray-100 cursor-pointer"
								>
									<EllipsisVertical size={14} color="#94A3B8" />
								</button>
							}
							className="pt-2 flex flex-col w-40"
						>
							<button
								onClick={handleDelete}
								disabled={deleteBroadcast.isPending}
								className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#DC2626] hover:bg-red-50 cursor-pointer disabled:opacity-60"
							>
								<Trash2 size={16} />
								Delete draft
							</button>
						</CustomPopover>
						)}
					</>
				}
			/>

			{step === "edit" ? (
				<EmailEditor
					key={editorKey}
					initial={loaded}
					onChange={setDesign}
					header={
						<div className="flex flex-col gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 pt-5 pb-4">
							<label htmlFor="subject" className="text-xs text-[#334155]">
								Subject Line
							</label>
							<div className="flex items-center gap-2 rounded-[4px] border border-[#E2E8F0] px-3 h-9 focus-within:border-[#0091FE]">
								<input
									id="subject"
									value={state.draft.subject}
									placeholder="New Broadcast"
									onChange={(e) => update({ subject: e.target.value })}
									className="flex-1 min-w-0 text-sm text-[#0F172A] outline-none bg-transparent placeholder:text-[#0F172A]/60"
								/>
								<button
									title="Suggest a subject line with AI"
									aria-label="Suggest a subject line with AI"
									onClick={() =>
										// TODO: wire to the AI writer endpoint
										toast.info("AI subject suggestions aren't available yet")
									}
									className="text-[#94A3B8] hover:text-[#0091FE] cursor-pointer"
								>
									<Zap size={14} />
								</button>
							</div>
							{showPreviewText ? (
								<input
									aria-label="Preview text"
									value={state.draft.preview_text}
									placeholder="Preview text shown after the subject in the inbox"
									onChange={(e) => update({ preview_text: e.target.value })}
									className="rounded-[4px] border border-[#E2E8F0] px-3 h-8 text-xs text-[#0F172A] outline-none focus:border-[#0091FE]"
								/>
							) : (
								<button
									onClick={() => setShowPreviewText(true)}
									className="w-fit flex items-center gap-1 text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
								>
									<Plus size={14} />
									Add preview text
								</button>
							)}
						</div>
					}
					side={
						<div className="rounded-md border border-[#E2E8F0] bg-white p-4">
							<TemplateSection
								templateName={templateName}
								onApply={applyTemplate}
								onSave={saveAsTemplate}
								saving={createTemplate.isPending}
							/>
						</div>
					}
				/>
			) : (
				<div className="flex max-lg:flex-col items-start justify-center gap-6">
					<div className="flex flex-col w-full min-w-0 max-w-[760px]">
						<PreviewHeader
							email={state.draft}
							onEditRecipients={() => setPickerOpen(true)}
						/>
						{/* Exactly the HTML recipients get */}
						<iframe
							title="Email preview"
							srcDoc={renderPreviewHtml(state.design)}
							sandbox=""
							className="h-[75vh] w-full border border-t-0 border-[#E2E8F0] bg-white"
						/>
					</div>
					<PreviewPanel
						audience={state.draft.audience}
						onAudienceChange={(audience) => update({ audience })}
						pickerOpen={pickerOpen}
						setPickerOpen={setPickerOpen}
						schedule={schedule}
						scheduledAt={scheduledAt}
						onScheduleChange={setSchedule}
						onScheduledAtChange={setScheduledAt}
						onSendTest={handleTest}
						testing={testBroadcast.isPending}
					/>
				</div>
			)}

			<div className="fixed bottom-0 right-0 z-20 flex items-center gap-5 px-5 py-4">
				{step === "preview" && (
					<button
						onClick={() => setStep("edit")}
						className="text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
					>
						Back to edit
					</button>
				)}
				<SavedStatus saving={saving} failed={failed} />
				<CustomButton
					onClick={handleContinue}
					disabled={sending}
					className="rounded-[4px] border-0 px-5 min-h-8 py-1.5 text-[13px] font-normal"
				>
					{sending && <LoaderCircle size={14} className="animate-spin" />}
					{step === "edit" ? "Continue" : schedule ? "Schedule" : "Send"}
				</CustomButton>
			</div>

			<ConfirmationModal
				open={sent !== null}
				title={sent === "scheduled" ? "Mail Scheduled" : "Mail Sent"}
				description={
					sent === "scheduled"
						? "Your mail is scheduled. You can cancel it from Bulk Email before it goes out."
						: "Your mail is on its way. Track delivery from its report."
				}
				actionLabel="Done"
				onAction={() => router.push("/bulk-email")}
			/>
		</div>
	);
}

function Centered({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center gap-4 py-24">{children}</div>
	);
}

function ExistingBroadcast({ id }: { id: string }) {
	const router = useRouter();
	const { data, isLoading, isError } = useBroadcast(id);
	const editable = data ? EDITABLE_STATUSES.includes(data.status) : true;

	useEffect(() => {
		if (data && !editable) router.replace(`/bulk-email/${id}`);
	}, [data, editable, id, router]);

	if (isLoading || (data && !editable)) return <EditorPageSkeleton />;
	if (isError || !data) {
		return (
			<Centered>
				<span className="text-base text-foreground">
					This email couldn&apos;t be found
				</span>
				<Link href="/bulk-email" className="text-sm text-[#0091FE] hover:underline">
					Back to Bulk Email
				</Link>
			</Centered>
		);
	}
	const loaded = loadDesign(data);
	return (
		<Editor
			key={data._id}
			initialId={data._id}
			scheduledAt={data.status === "scheduled" ? data.scheduled_at : null}
			loaded={loaded}
			initial={stateFromBroadcast(data, loaded)}
		/>
	);
}

const stateFromBroadcast = (b: Broadcast, loaded: LoadedDesign): EditorState => ({
	draft: {
		name: b.name ?? "",
		subject: b.subject ?? "",
		preview_text: b.preview_text ?? "",
		audience: b.audience ?? { all: true },
		template_id: b.template_id ?? null,
	},
	design: loaded.design,
});

function NewBroadcast({ templateId }: { templateId?: string }) {
	const { data: template, isLoading, isError } = useEmailTemplate(templateId);

	useEffect(() => {
		if (templateId && isError) toast.error("Couldn't load that template");
	}, [templateId, isError]);

	if (templateId && isLoading) return <EditorPageSkeleton />;

	const loaded: LoadedDesign = template
		? loadDesign(template)
		: { design: createDefaultDesign(), initial: createDefaultDesign().doc };
	return (
		<Editor
			initialId={null}
			initialTemplateName={template?.name}
			loaded={loaded}
			initial={{
				draft: {
					name: "New Broadcast",
					subject: template?.subject ?? "",
					preview_text: template?.preview_text ?? "",
					audience: { all: true },
					template_id: template?._id ?? null,
				},
				design: loaded.design,
			}}
		/>
	);
}

export default function BroadcastEditor({
	id,
	templateId,
}: {
	id?: string;
	templateId?: string;
}) {
	return id ? <ExistingBroadcast id={id} /> : <NewBroadcast templateId={templateId} />;
}
