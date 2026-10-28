import { EmailContent } from "./bulk_email";

export type AutomationStatus = "draft" | "scheduled" | "published";

export type TriggerCategory = "pipeline" | "bulk_email";

export interface TriggerConfig {
	title: string;
	category: TriggerCategory;
	group: string;
	event: string;
}

export type DelayUnit = "minutes" | "hours" | "days" | "weeks";

export interface DelayConfig {
	title: string;
	wait_for: "time_delay" | "specific_date";
	amount: number;
	unit: DelayUnit;
	date: string;
}

export interface EmailStepConfig {
	title: string;
	sender_name: string;
	sender_email: string;
	preview_text: string;
	template_id: string | null;
	template_name: string;
	ab_test: boolean;
	content: EmailContent;
}

export type SplitCategory = "email" | "subscriber" | "purchase";

export interface SplitConfig {
	title: string;
	category: SplitCategory;
	path_a: string;
	path_b: string;
}

export interface ActionConfig {
	action: string;
}

export type WorkflowStep =
	| { id: string; type: "email"; config: EmailStepConfig }
	| { id: string; type: "delay"; config: DelayConfig }
	| { id: string; type: "action"; config: ActionConfig }
	| {
			id: string;
			type: "split";
			config: SplitConfig;
			paths: { a: WorkflowStep[]; b: WorkflowStep[] };
	  };

export type StepType = WorkflowStep["type"];

export interface Automation {
	_id: string;
	name: string;
	status: AutomationStatus;
	active: boolean;
	trigger: TriggerConfig;
	steps: WorkflowStep[];
	audience: string;
	send_at: string | null;
	stats: { clicks: number; sent: number; opens: number };
	updated_at: string;
}

export interface WorkflowTemplate {
	_id: string;
	name: string;
	description: string;
	category: string;
	build: () => Pick<Automation, "name" | "trigger" | "steps">;
}
