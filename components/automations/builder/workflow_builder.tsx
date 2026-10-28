"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAutomationStore } from "@/stores/automation/automation_store";
import { useBulkEmailStore } from "@/stores/bulk_email/bulk_email_store";
import {
	LIBRARY_TEMPLATES,
	TEMPLATE_CATEGORIES,
} from "@/components/bulk_email/data";
import ConfirmationModal from "@/components/bulk_email/confirmation_modal";
import { Automation, EmailStepConfig, WorkflowStep } from "@/types/automation";
import { createStep } from "../data";
import TemplatePicker from "../template_picker";
import { findStep, insertStep, removeStep, updateStep } from "../workflow";
import BuilderHeader, { UndoRedo, headerCta } from "./builder_header";
import {
	ActionPanel,
	DelayPanel,
	EmailPanel,
	SplitPanel,
	TriggerPanel,
} from "./panels";
import PublishModal from "./publish_modal";
import { useHistory } from "./use_history";
import WorkflowCanvas from "./workflow_canvas";

const EMAIL_CATEGORIES = [
	...TEMPLATE_CATEGORIES,
	{
		value: "saved",
		label: "My templates",
		heading: "My templates",
		description: "Templates your team saved from Bulk Email.",
	},
];

function Builder({ initial }: { initial: Automation }) {
	const router = useRouter();
	const { saveAutomation } = useAutomationStore();
	const savedTemplates = useBulkEmailStore((s) => s.templates);
	const { state: automation, set, undo, redo, canUndo, canRedo } =
		useHistory(initial);
	const [selected, setSelected] = useState<string | null>("trigger");
	const [publishing, setPublishing] = useState(false);
	const [published, setPublished] = useState(false);
	// Email step waiting for a design, with the panel values to keep
	const [pickingFor, setPickingFor] = useState<{
		id: string;
		config: EmailStepConfig;
	} | null>(null);

	// TODO: persist through the automation endpoint once it exists
	useEffect(() => {
		saveAutomation({ ...automation, updated_at: new Date().toISOString() });
	}, [automation, saveAutomation]);

	const setSteps = (fn: (steps: WorkflowStep[]) => WorkflowStep[]) =>
		set((a) => ({ ...a, steps: fn(a.steps) }));

	const saveConfig = <T extends WorkflowStep>(id: string, config: T["config"]) => {
		setSteps((steps) =>
			updateStep(steps, id, (s) => ({ ...s, config }) as WorkflowStep),
		);
		toast.success("Step saved");
	};

	const deleteStep = (id: string) => {
		setSteps((steps) => removeStep(steps, id));
		setSelected(null);
	};

	const step = selected && selected !== "trigger"
		? findStep(automation.steps, selected)
		: undefined;

	const emailItems = [
		...LIBRARY_TEMPLATES.map((t) => ({ ...t, id: t._id })),
		...savedTemplates.map((t) => ({ ...t, id: t._id, category: "saved" })),
	];

	const panel = (() => {
		if (selected === "trigger")
			return (
				<TriggerPanel
					key="trigger"
					initial={automation.trigger}
					onSave={(trigger) => {
						set((a) => ({ ...a, trigger }));
						toast.success("Trigger saved");
					}}
				/>
			);
		if (!step) return null;
		const onDelete = () => deleteStep(step.id);
		switch (step.type) {
			case "delay":
				return (
					<DelayPanel
						key={step.id}
						onDelete={onDelete}
						initial={step.config}
						onSave={(c) => saveConfig(step.id, c)}
					/>
				);
			case "email":
				return (
					<EmailPanel
						key={step.id}
						onDelete={onDelete}
						initial={step.config}
						onSave={(c) => saveConfig(step.id, c)}
						onCreateContent={(config) => setPickingFor({ id: step.id, config })}
					/>
				);
			case "split":
				return (
					<SplitPanel
						key={step.id}
						onDelete={onDelete}
						initial={step.config}
						onSave={(c) => saveConfig(step.id, c)}
					/>
				);
			case "action":
				return (
					<ActionPanel
						key={step.id}
						onDelete={onDelete}
						initial={step.config}
						onSave={(c) => saveConfig(step.id, c)}
					/>
				);
		}
	})();

	const startPublish = () => {
		if (!automation.trigger.event) {
			setSelected("trigger");
			toast.error("Choose what will trigger the workflow first");
			return;
		}
		if (automation.steps.length === 0) {
			toast.error("Add at least one step to the workflow");
			return;
		}
		setPublishing(true);
	};

	return (
		<div className="min-h-screen flex flex-col">
			<BuilderHeader
				backHref="/automations"
				title={automation.name}
				onTitleChange={(name) => set((a) => ({ ...a, name }))}
				center={
					<div className="flex items-center gap-1 max-lg:hidden">
						<span className="text-base font-semibold text-white">Status:</span>
						<span className="rounded-lg bg-white px-6 py-1.5 text-xs capitalize text-[#0091FE]">
							{automation.status}
						</span>
					</div>
				}
				actions={
					<UndoRedo
						onUndo={undo}
						onRedo={redo}
						canUndo={canUndo}
						canRedo={canRedo}
					/>
				}
				cta={
					<button onClick={startPublish} className={headerCta}>
						Publish workflow
					</button>
				}
			/>

			<div className="flex max-lg:flex-col flex-1">
				<div
					className="flex-1 min-w-0 overflow-auto lg:m-2.5 bg-[#F7FAFC] bg-[radial-gradient(#6B7D9180_1px,transparent_1px)] bg-size-[16px_16px] max-lg:min-h-[70vh]"
					onClick={(e) => e.target === e.currentTarget && setSelected(null)}
				>
					<WorkflowCanvas
						trigger={automation.trigger}
						steps={automation.steps}
						selected={selected}
						onSelect={setSelected}
						onAdd={(at, type) => {
							const created = createStep(type);
							setSteps((steps) => insertStep(steps, at, created));
							setSelected(created.id);
						}}
					/>
				</div>

				<aside className="lg:w-[383px] w-full shrink-0 bg-white border border-[#D9E1E8] rounded-lg px-5 pt-6 pb-10 lg:sticky lg:top-29 lg:h-[calc(100vh-7.25rem)] overflow-y-auto">
					{panel ?? (
						<p className="pt-10 text-center text-sm text-[#64748B]">
							Select a step to set it up, or use + to add one.
						</p>
					)}
				</aside>
			</div>

			<TemplatePicker
				open={pickingFor !== null}
				onOpenChange={(o) => !o && setPickingFor(null)}
				title="Select email template for your workflow"
				variant="pills"
				categories={EMAIL_CATEGORIES}
				items={emailItems}
				onUse={(templateId) => {
					const template = emailItems.find((t) => t.id === templateId);
					if (!pickingFor || !template) return;
					const next = {
						...automation,
						steps: updateStep(automation.steps, pickingFor.id, (s) => ({
							...s,
							config: {
								...pickingFor.config,
								template_id: template.id,
								template_name: template.name,
								content: structuredClone(template.content),
							},
						}) as WorkflowStep),
					};
					set(next);
					saveAutomation(next);
					router.push(`/automations/${automation._id}/email/${pickingFor.id}`);
				}}
			/>

			{publishing && (
				<PublishModal
					open
					onOpenChange={setPublishing}
					audience={automation.audience}
					sendAt={automation.send_at}
					onPublish={(audience, send_at) => {
						// TODO: publish through the automation endpoint once it exists
						set((a) => ({
							...a,
							audience,
							send_at,
							status: send_at ? "scheduled" : "published",
							active: true,
						}));
						setPublishing(false);
						setPublished(true);
					}}
				/>
			)}

			<ConfirmationModal
				open={published}
				title={automation.send_at ? "Automation scheduled" : "Automation published"}
				description={
					automation.send_at
						? "Your workflow is scheduled"
						: "Your workflow is published"
				}
				actionLabel="Done"
				onAction={() => router.push("/automations")}
			/>
		</div>
	);
}

export default function WorkflowBuilder({ id }: { id: string }) {
	const automation = useAutomationStore((s) =>
		s.automations.find((a) => a._id === id),
	);

	if (!automation) {
		return (
			<div className="flex flex-col items-center gap-4 py-24">
				<span className="text-base text-foreground">
					This automation couldn&apos;t be found
				</span>
				<Link href="/automations" className="text-sm text-[#0091FE] hover:underline">
					Back to automations
				</Link>
			</div>
		);
	}

	// Keyed so switching automations resets the builder state
	return <Builder key={id} initial={automation} />;
}
