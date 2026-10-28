"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Monitor, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useAutomationStore } from "@/stores/automation/automation_store";
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import EmailCanvas from "@/components/bulk_email/editor/email_canvas";
import FormatToolbar from "@/components/bulk_email/editor/format_toolbar";
import TemplateSection from "@/components/bulk_email/editor/template_section";
import { ColorField, Toggle } from "@/components/bulk_email/editor/controls";
import {
	ImageInspector,
	StylesInspector,
} from "@/components/bulk_email/editor/inspector";
import { EmailContent } from "@/types/bulk_email";
import { Automation, EmailStepConfig, WorkflowStep } from "@/types/automation";
import { findStep, updateStep } from "../workflow";
import BuilderHeader, { UndoRedo, headerCta, headerIconButton } from "./builder_header";
import { useHistory } from "./use_history";

function Editor({
	automation,
	stepId,
	initial,
}: {
	automation: Automation;
	stepId: string;
	initial: EmailStepConfig;
}) {
	const router = useRouter();
	const { saveAutomation } = useAutomationStore();
	const { saveTemplate } = useBulkEmailStore();
	const { state: config, set, undo, redo, canUndo, canRedo } =
		useHistory(initial);
	const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
	const [previewing, setPreviewing] = useState(false);
	const [panel, setPanel] = useState<"styles" | "image">("styles");
	const builderHref = `/automations/${automation._id}`;

	const updateContent = (patch: Partial<EmailContent>) =>
		set((c) => ({ ...c, content: { ...c.content, ...patch } }));

	const saveAndContinue = () => {
		// TODO: persist through the automation endpoint once it exists
		saveAutomation({
			...automation,
			steps: updateStep(automation.steps, stepId, (s) => ({ ...s, config }) as WorkflowStep),
			updated_at: new Date().toISOString(),
		});
		toast.success("Email saved");
		router.push(builderHref);
	};

	const deviceButton = (value: "desktop" | "mobile", Icon: React.ElementType) => (
		<button
			aria-label={`${value} preview`}
			aria-pressed={device === value}
			onClick={() => setDevice(value)}
			className={`${headerIconButton} ${device === value ? "" : "opacity-70"}`}
		>
			<Icon size={18} />
		</button>
	);

	return (
		<div className="min-h-screen flex flex-col">
			<BuilderHeader
				backHref={builderHref}
				title={config.title}
				editableIcon={false}
				onTitleChange={(title) => set((c) => ({ ...c, title }))}
				center={
					<div className="flex items-center gap-2 max-md:hidden">
						{deviceButton("desktop", Monitor)}
						{deviceButton("mobile", Smartphone)}
					</div>
				}
				actions={
					<>
						<button
							aria-label={previewing ? "Back to editing" : "Preview"}
							title={previewing ? "Back to editing" : "Preview"}
							onClick={() => setPreviewing((p) => !p)}
							className={headerIconButton}
						>
							{previewing ? <EyeOff size={16} /> : <Eye size={16} />}
						</button>
						<UndoRedo
							onUndo={undo}
							onRedo={redo}
							canUndo={canUndo}
							canRedo={canRedo}
						/>
					</>
				}
				cta={
					<button onClick={saveAndContinue} className={headerCta}>
						Save &amp; Continue
					</button>
				}
			/>

			<div className="relative flex max-lg:flex-col flex-1">
				{!previewing && (
					<aside className="lg:absolute lg:left-0 lg:top-0 z-10 lg:w-70 w-full flex flex-col gap-5 rounded-lg border border-[#D9E1E8] bg-white p-4 shadow-sm">
						<h3 className="text-xs font-semibold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
							Email
						</h3>
						<TemplateSection
							templateName={config.template_name}
							onApply={(content, template_id) => {
								const name =
									useBulkEmailStore.getState().templates.find((t) => t._id === template_id)
										?.name ?? config.template_name;
								set((c) => ({ ...c, content, template_id, template_name: name }));
							}}
							onSave={() => {
								// TODO: save through the templates endpoint once it exists
								saveTemplate({
									_id: crypto.randomUUID(),
									name: config.title || "Untitled template",
									description: config.preview_text,
									category: "starting",
									content: structuredClone(config.content),
									updated_at: new Date().toISOString(),
								});
								toast.success("Saved as a template");
							}}
						/>
						<ColorField
							label="Background color"
							value={config.content.background_color}
							onChange={(background_color) => updateContent({ background_color })}
						/>
						<div className="border-t border-[#F1F5F9] pt-4">
							<Toggle
								label="Run an A/B Test"
								checked={config.ab_test}
								onChange={(ab_test) => set((c) => ({ ...c, ab_test }))}
							/>
						</div>
					</aside>
				)}

				<div className="flex-1 min-w-0 overflow-auto lg:m-2.5 bg-[#F7FAFC] bg-[radial-gradient(#6B7D9180_1px,transparent_1px)] bg-size-[16px_16px] p-4 lg:pl-75 lg:pr-4 lg:pt-10">
					<div
						className={`mx-auto bg-white transition-all ${device === "mobile" ? "max-w-[420px]" : "max-w-[842px]"}`}
					>
						{!previewing && (
							<div className="flex justify-center bg-white px-4 py-4">
								<FormatToolbar className="w-full max-w-[510px] rounded-md border border-[#E2E8F0] bg-white px-2 py-1 shadow-sm" />
							</div>
						)}
						<EmailCanvas
							editable={!previewing}
							content={config.content}
							imageSelected={!previewing && panel === "image"}
							onSelectImage={previewing ? undefined : () => setPanel("image")}
							onSelectText={() => setPanel("styles")}
							onHtmlChange={(html) => updateContent({ html })}
						/>
					</div>
				</div>

				{!previewing && (
					<aside className="lg:w-80 w-full shrink-0 bg-white border-l border-[#E2E8F0] lg:sticky lg:top-29 lg:h-[calc(100vh-7.25rem)] overflow-y-auto">
						{panel === "image" ? (
							<ImageInspector
								image={config.content.image}
								onBack={() => setPanel("styles")}
								onChange={(patch) =>
									updateContent({ image: { ...config.content.image, ...patch } })
								}
							/>
						) : (
							<StylesInspector content={config.content} onChange={updateContent} />
						)}
					</aside>
				)}
			</div>
		</div>
	);
}

export default function EmailBuilder({
	id,
	stepId,
}: {
	id: string;
	stepId: string;
}) {
	const automation = useAutomationStore((s) =>
		s.automations.find((a) => a._id === id),
	);
	const step = automation && findStep(automation.steps, stepId);

	if (!automation || step?.type !== "email") {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<span className="text-base text-foreground">
					This email step couldn&apos;t be found
				</span>
				<Link
					href={automation ? `/automations/${id}` : "/automations"}
					className="text-sm text-[#0091FE] hover:underline"
				>
					Back to the workflow
				</Link>
			</div>
		);
	}

	return (
		<Editor
			key={stepId}
			automation={automation}
			stepId={stepId}
			initial={step.config}
		/>
	);
}
