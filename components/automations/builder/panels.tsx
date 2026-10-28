"use client";

import { useState } from "react";
import { Hourglass, Mail, Split, Trash2, UserPlus, Zap } from "lucide-react";
import {
	ActionConfig,
	DelayConfig,
	EmailStepConfig,
	SplitConfig,
	StepType,
	TriggerCategory,
	TriggerConfig,
} from "@/types/automation";
import {
	ACTIONS,
	DELAY_UNITS,
	SPLIT_CATEGORIES,
	SPLIT_CONDITIONS,
	TRIGGER_CATEGORIES,
	TRIGGER_EVENTS,
	TRIGGER_GROUPS,
} from "../data";
import {
	Field,
	PanelTitle,
	SaveButton,
	SelectInput,
	TextArea,
	TextInput,
} from "./fields";

export const STEP_ICONS: Record<StepType | "trigger", React.ElementType> = {
	trigger: UserPlus,
	email: Mail,
	delay: Hourglass,
	split: Split,
	action: Zap,
};

function PanelShell({
	type,
	title,
	onSave,
	onDelete,
	children,
}: {
	type: StepType | "trigger";
	title: string;
	onSave: () => void;
	onDelete?: () => void;
	children: React.ReactNode;
}) {
	const Icon = STEP_ICONS[type];
	return (
		<div className="flex flex-col gap-8">
			<PanelTitle icon={<Icon size={18} />}>{title}</PanelTitle>
			<div className="flex flex-col gap-4">{children}</div>
			<div className="flex items-center justify-between pt-8">
				<SaveButton onClick={onSave} />
				{onDelete && (
					<button
						type="button"
						onClick={onDelete}
						className="flex items-center gap-1.5 text-xs text-[#DC2626] hover:underline cursor-pointer"
					>
						<Trash2 size={14} />
						Delete step
					</button>
				)}
			</div>
		</div>
	);
}

export function TriggerPanel({
	initial,
	onSave,
}: {
	initial: TriggerConfig;
	onSave: (config: TriggerConfig) => void;
}) {
	const [c, setC] = useState(initial);
	return (
		<PanelShell type="trigger" title="Trigger setup" onSave={() => onSave(c)}>
			<Field label="Trigger title">
				<TextInput
					value={c.title}
					onChange={(e) => setC({ ...c, title: e.target.value })}
				/>
			</Field>
			<Field label="Select Category">
				<SelectInput
					value={c.category}
					options={TRIGGER_CATEGORIES}
					onChange={(v) => {
						const category = v as TriggerCategory;
						setC({
							...c,
							category,
							group: TRIGGER_GROUPS[category][0],
							event: "",
						});
					}}
				/>
			</Field>
			<Field label="Select group">
				<SelectInput
					value={c.group}
					options={
						TRIGGER_GROUPS[c.category].includes(c.group)
							? TRIGGER_GROUPS[c.category]
							: [c.group, ...TRIGGER_GROUPS[c.category]]
					}
					onChange={(group) => setC({ ...c, group })}
				/>
			</Field>
			<Field label="What will trigger the workflow?">
				<SelectInput
					value={c.event}
					placeholder="What will trigger the workflow?"
					options={TRIGGER_EVENTS[c.category]}
					onChange={(event) => setC({ ...c, event })}
				/>
			</Field>
		</PanelShell>
	);
}

export function DelayPanel({
	initial,
	onSave,
	onDelete,
}: {
	initial: DelayConfig;
	onSave: (config: DelayConfig) => void;
	onDelete: () => void;
}) {
	const [c, setC] = useState(initial);
	return (
		<PanelShell
			type="delay"
			title="Delay setup"
			onSave={() => onSave(c)}
			onDelete={onDelete}
		>
			<Field label="Delay title">
				<TextInput
					value={c.title}
					onChange={(e) => setC({ ...c, title: e.target.value })}
				/>
			</Field>
			<Field label="Wait for?">
				<SelectInput
					value={c.wait_for}
					options={[
						{ value: "time_delay", label: "Time delay" },
						{ value: "specific_date", label: "A specific date" },
					]}
					onChange={(v) =>
						setC({ ...c, wait_for: v as DelayConfig["wait_for"] })
					}
				/>
			</Field>
			{c.wait_for === "time_delay" ? (
				<div className="flex gap-5">
					<Field label="Of" className="w-16 shrink-0">
						<TextInput
							type="number"
							min={1}
							value={c.amount}
							onChange={(e) =>
								setC({ ...c, amount: Math.max(1, Number(e.target.value) || 1) })
							}
						/>
					</Field>
					<Field label="Select time period" className="flex-1">
						<SelectInput
							value={c.unit}
							options={DELAY_UNITS}
							onChange={(v) => setC({ ...c, unit: v as DelayConfig["unit"] })}
						/>
					</Field>
				</div>
			) : (
				<Field label="Date">
					<TextInput
						type="date"
						value={c.date}
						onChange={(e) => setC({ ...c, date: e.target.value })}
					/>
				</Field>
			)}
		</PanelShell>
	);
}

export function EmailPanel({
	initial,
	onSave,
	onDelete,
	onCreateContent,
}: {
	initial: EmailStepConfig;
	onSave: (config: EmailStepConfig) => void;
	onDelete: () => void;
	// Saves the panel's current values, then opens the email design flow
	onCreateContent: (config: EmailStepConfig) => void;
}) {
	const [c, setC] = useState(initial);
	return (
		<PanelShell
			type="email"
			title="Email setup"
			onSave={() => onSave(c)}
			onDelete={onDelete}
		>
			<Field label="Email title">
				<TextInput
					value={c.title}
					onChange={(e) => setC({ ...c, title: e.target.value })}
				/>
			</Field>
			<Field label="Enter sender name">
				<TextInput
					value={c.sender_name}
					onChange={(e) => setC({ ...c, sender_name: e.target.value })}
				/>
			</Field>
			<Field label="Sender’s email address">
				<TextInput
					type="email"
					value={c.sender_email}
					placeholder="you@company.com"
					onChange={(e) => setC({ ...c, sender_email: e.target.value })}
				/>
			</Field>
			<Field label="Email Preview text (optional)">
				<TextArea
					value={c.preview_text}
					onChange={(e) => setC({ ...c, preview_text: e.target.value })}
				/>
			</Field>
			<Field label="Email design">
				<TextInput readOnly value={c.template_name} />
			</Field>
			<button
				type="button"
				onClick={() => onCreateContent(c)}
				className="h-8.5 rounded-full bg-[#0091FE] text-xs font-semibold text-white hover:bg-[#0082E6] cursor-pointer"
			>
				Create email content
			</button>
		</PanelShell>
	);
}

export function SplitPanel({
	initial,
	onSave,
	onDelete,
}: {
	initial: SplitConfig;
	onSave: (config: SplitConfig) => void;
	onDelete: () => void;
}) {
	const [c, setC] = useState(initial);
	const conditions = SPLIT_CONDITIONS[c.category];
	return (
		<PanelShell
			type="split"
			title="Split setup"
			onSave={() => onSave(c)}
			onDelete={onDelete}
		>
			<Field label="Split title">
				<TextInput
					value={c.title}
					onChange={(e) => setC({ ...c, title: e.target.value })}
				/>
			</Field>
			<Field label="Condition">
				<SelectInput
					value={c.category}
					options={SPLIT_CATEGORIES}
					onChange={(v) => {
						const category = v as SplitConfig["category"];
						const options = SPLIT_CONDITIONS[category];
						setC({ ...c, category, path_a: options[0], path_b: options[1] });
					}}
				/>
			</Field>
			<Field label="Choose path A condition">
				<SelectInput
					value={c.path_a}
					options={conditions}
					onChange={(path_a) => setC({ ...c, path_a })}
				/>
			</Field>
			<Field label="Choose path B condition">
				<SelectInput
					value={c.path_b}
					options={conditions}
					onChange={(path_b) => setC({ ...c, path_b })}
				/>
			</Field>
		</PanelShell>
	);
}

export function ActionPanel({
	initial,
	onSave,
	onDelete,
}: {
	initial: ActionConfig;
	onSave: (config: ActionConfig) => void;
	onDelete: () => void;
}) {
	const [c, setC] = useState(initial);
	return (
		<PanelShell
			type="action"
			title="Action setup"
			onSave={() => onSave(c)}
			onDelete={onDelete}
		>
			<Field label="WHAT ACTION SHOULD BE PERFORMED?">
				<SelectInput
					value={c.action}
					placeholder="Choose an action"
					options={ACTIONS}
					onChange={(action) => setC({ action })}
				/>
			</Field>
		</PanelShell>
	);
}
