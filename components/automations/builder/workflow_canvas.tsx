"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import EmailCanvas from "@/components/bulk_email/editor/email_canvas";
import { StepType, TriggerConfig, WorkflowStep } from "@/types/automation";
import { STEP_LABELS, stepLabel, triggerLabel } from "../data";
import { InsertPoint } from "../workflow";
import { STEP_ICONS } from "./panels";

const ADDABLE: StepType[] = ["delay", "email", "split", "action"];

const Line = ({ className = "h-12" }: { className?: string }) => (
	<span className={`block w-px bg-[#A4A4A4] ${className}`} />
);

function AddStep({
	at,
	onAdd,
	last,
}: {
	at: InsertPoint;
	onAdd: (at: InsertPoint, type: StepType) => void;
	last?: boolean;
}) {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-col items-center">
			<Line />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						aria-label="Add a step"
						className={`h-14 w-14 flex items-center justify-center cursor-pointer ${open ? "outline outline-[#0091FE]" : ""}`}
					>
						<span className="h-9.5 w-9.5 rounded-full bg-[#0091FE] flex items-center justify-center text-white hover:bg-[#0082E6]">
							<Plus size={18} />
						</span>
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="center"
					sideOffset={-16}
					className="w-[355px] p-0 rounded-none border border-[#D9E1E8] shadow-sm gap-0"
				>
					<p className="py-3 text-center text-base text-black border-b border-[#D9E1E8]">
						Add new steps
					</p>
					<div className="grid grid-cols-4 py-2 border-b border-[#D9E1E8]">
						{ADDABLE.map((type) => {
							const Icon = STEP_ICONS[type];
							return (
								<button
									key={type}
									onClick={() => {
										setOpen(false);
										onAdd(at, type);
									}}
									className="flex flex-col items-center gap-1.5 py-2 text-xs text-[#4A4A4A] hover:bg-[#F2F7FB] cursor-pointer"
								>
									<Icon size={22} color="#0F172A" />
									{STEP_LABELS[type]}
								</button>
							);
						})}
					</div>
					<p className="py-3 text-center text-xs text-[#4A4A4A]">
						Choose a step to continue your workflow
					</p>
				</PopoverContent>
			</Popover>
			{!last && <Line />}
		</div>
	);
}

function Node({
	type,
	label,
	selected,
	onSelect,
	small,
}: {
	type: StepType | "trigger";
	label: string;
	selected: boolean;
	onSelect: () => void;
	small?: boolean;
}) {
	const Icon = STEP_ICONS[type];
	return (
		<button
			onClick={onSelect}
			className={`flex items-center justify-center gap-2 bg-white px-4 text-base font-medium text-black cursor-pointer ${
				small ? "w-57.5 h-14" : "w-71.5 h-17.5"
			} ${selected ? "outline-2 outline-[#0076D6]" : "outline outline-[#D9E1E8] hover:outline-[#0076D6]/60"}`}
		>
			<Icon size={20} className="shrink-0" />
			<span className="truncate">{label}</span>
		</button>
	);
}

function EmailNode({
	step,
	selected,
	onSelect,
}: {
	step: Extract<WorkflowStep, { type: "email" }>;
	selected: boolean;
	onSelect: () => void;
}) {
	const Icon = STEP_ICONS.email;
	// A div, not a button: the email preview inside contains its own button
	return (
		<div
			role="button"
			tabIndex={0}
			onClick={onSelect}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect();
				}
			}}
			className={`w-71.5 bg-white text-left cursor-pointer ${selected ? "outline-2 outline-[#0076D6]" : "outline outline-[#D9E1E8] hover:outline-[#0076D6]/60"}`}
		>
			<span className="flex items-center justify-center gap-2 h-11 border-b border-[#D9E1E8] text-base font-medium text-black">
				<Icon size={20} />
				<span className="truncate">{stepLabel(step)}</span>
			</span>
			<span className="block p-3.5">
				<span className="block h-46.5 overflow-hidden rounded-lg bg-[#F2F7FB] pointer-events-none">
					<span className="block w-[640px] origin-top-left scale-40">
						<EmailCanvas size="md" content={step.config.content} />
					</span>
				</span>
			</span>
		</div>
	);
}

interface ListProps {
	selected: string | null;
	onSelect: (id: string) => void;
	onAdd: (at: InsertPoint, type: StepType) => void;
}

function StepList({
	steps,
	parentId,
	path,
	...props
}: ListProps & {
	steps: WorkflowStep[];
	parentId: string | null;
	path: "a" | "b" | null;
}) {
	const small = path !== null;
	return (
		<>
			<AddStep
				at={{ parentId, path, index: 0 }}
				onAdd={props.onAdd}
				last={steps.length === 0}
			/>
			{steps.map((step, i) => (
				<div key={step.id} className="flex flex-col items-center">
					{step.type === "email" ? (
						<EmailNode
							step={step}
							selected={props.selected === step.id}
							onSelect={() => props.onSelect(step.id)}
						/>
					) : (
						<Node
							type={step.type}
							label={stepLabel(step)}
							small={small}
							selected={props.selected === step.id}
							onSelect={() => props.onSelect(step.id)}
						/>
					)}
					{step.type === "split" && (
						<>
							<Line className="h-8" />
							<div className="relative flex gap-16 items-start">
								{/* bar joining the two branches */}
								<span className="absolute top-0 left-[calc(25%-16px)] right-[calc(25%-16px)] h-px bg-[#A4A4A4]" />
								{(["a", "b"] as const).map((p) => (
									<div key={p} className="flex-1 basis-0 min-w-61 flex flex-col items-center">
										<Line className="h-10" />
										<span
											className={`w-61 h-12.5 rounded-lg flex items-center justify-center px-3 text-base font-medium text-black text-center ${
												p === "a" ? "bg-[#D8F3F1]" : "bg-[#FEE2E2]"
											}`}
										>
											{p === "a" ? step.config.path_a : step.config.path_b}
										</span>
										<StepList
											{...props}
											steps={step.paths[p]}
											parentId={step.id}
											path={p}
										/>
									</div>
								))}
							</div>
						</>
					)}
					<AddStep
						at={{ parentId, path, index: i + 1 }}
						onAdd={props.onAdd}
						last={i === steps.length - 1}
					/>
				</div>
			))}
		</>
	);
}

export default function WorkflowCanvas({
	trigger,
	steps,
	...props
}: ListProps & { trigger: TriggerConfig; steps: WorkflowStep[] }) {
	return (
		<div className="min-w-max flex flex-col items-center px-10 pt-24 pb-40">
			<Node
				type="trigger"
				label={triggerLabel(trigger)}
				selected={props.selected === "trigger"}
				onSelect={() => props.onSelect("trigger")}
			/>
			<StepList {...props} steps={steps} parentId={null} path={null} />
		</div>
	);
}
