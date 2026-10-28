import {
	ActionConfig,
	Automation,
	DelayConfig,
	DelayUnit,
	EmailStepConfig,
	SplitCategory,
	SplitConfig,
	StepType,
	TriggerCategory,
	TriggerConfig,
	WorkflowStep,
	WorkflowTemplate,
} from "@/types/automation";
import {
	DEFAULT_TEMPLATE_NAME,
	createDefaultContent,
} from "@/components/bulk_email/data";

// Options and placeholder data for the automations UI. Everything lives in the
// client store until the automation endpoints exist.

export const TRIGGER_CATEGORIES: { value: TriggerCategory; label: string }[] = [
	{ value: "pipeline", label: "Pipeline" },
	{ value: "bulk_email", label: "Bulk Email" },
];

export const TRIGGER_GROUPS: Record<TriggerCategory, string[]> = {
	pipeline: ["Awotech new leads", "Enterprise deals", "Partnerships"],
	bulk_email: ["Hot", "Warm", "Cold"],
};

export const TRIGGER_EVENTS: Record<TriggerCategory, string[]> = {
	pipeline: ["Leads", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
	bulk_email: [
		"User subscribes",
		"Email is opened",
		"Link is clicked",
		"Email is unsubscribed from",
	],
};

export const DELAY_UNITS: { value: DelayUnit; label: string }[] = [
	{ value: "minutes", label: "Minute" },
	{ value: "hours", label: "Hour" },
	{ value: "days", label: "Day" },
	{ value: "weeks", label: "Week" },
];

export const SPLIT_CATEGORIES: { value: SplitCategory; label: string }[] = [
	{ value: "email", label: "Email activity" },
	{ value: "subscriber", label: "Subscriber activity" },
	{ value: "purchase", label: "Purchase and custom events" },
];

export const SPLIT_CONDITIONS: Record<SplitCategory, string[]> = {
	email: [
		"Email is opened",
		"Email is not opened",
		"Link is clicked",
		"Link is not clicked",
		"Email is delivered",
		"Email bounces",
		"Email is unsubscribed from",
	],
	subscriber: [
		"Contact has subscribed",
		"Contact has unsubscribed",
		"Contact has completed a form",
		"Contact has clicked a signup link",
		"Contact has been added to a group",
		"Contact has been removed from a group",
	],
	purchase: [
		"Order has been placed",
		"Order has not been placed",
		"Purchase amount is greater than a value",
		"Purchase amount is less than a value",
		"Custom event has occurred",
		"Custom event has not occurred",
	],
};

export const ACTIONS = [
	"Move subscriber to another group",
	"Copy subscriber to another group",
	"Remove subscriber from group",
	"Mark subscriber as unsubscribed",
	"Update subscriber's custom field",
	"Remove subscriber's custom field",
	"Add tag to subscriber",
	"Remove tag from subscriber",
];

export const AUDIENCES = ["Hot Contacts", "Warm Contacts", "Cold Contacts", "All Contacts"];

export const STEP_LABELS: Record<StepType, string> = {
	delay: "Delay",
	email: "Email",
	split: "Split",
	action: "Action",
};

export const createTrigger = (): TriggerConfig => ({
	title: "User subscribes",
	category: "pipeline",
	group: TRIGGER_GROUPS.pipeline[0],
	event: "",
});

const createEmailConfig = (): EmailStepConfig => ({
	title: "Send Email",
	sender_name: "CRM360",
	sender_email: "",
	preview_text: "",
	template_id: null,
	template_name: DEFAULT_TEMPLATE_NAME,
	ab_test: false,
	content: createDefaultContent(),
});

const createDelayConfig = (): DelayConfig => ({
	title: "",
	wait_for: "time_delay",
	amount: 2,
	unit: "days",
	date: "",
});

const createSplitConfig = (): SplitConfig => ({
	title: "",
	category: "email",
	path_a: "Email is opened",
	path_b: "Email is not opened",
});

const createActionConfig = (): ActionConfig => ({ action: "" });

export const createStep = (type: StepType): WorkflowStep => {
	const id = crypto.randomUUID();
	switch (type) {
		case "email":
			return { id, type, config: createEmailConfig() };
		case "delay":
			return { id, type, config: createDelayConfig() };
		case "split":
			return { id, type, config: createSplitConfig(), paths: { a: [], b: [] } };
		case "action":
			return { id, type, config: createActionConfig() };
	}
};

const unitLabel = (amount: number, unit: DelayUnit) => {
	const base = DELAY_UNITS.find((u) => u.value === unit)!.label.toLowerCase();
	return amount === 1 ? base : `${base}s`;
};

// The text shown on a step's node in the workflow canvas
export const stepLabel = (step: WorkflowStep) => {
	switch (step.type) {
		case "email":
			return step.config.title || "Send Email";
		case "delay": {
			const c = step.config;
			if (c.title) return c.title;
			if (c.wait_for === "specific_date")
				return c.date ? `wait until ${c.date}` : "wait until a date";
			return `wait ${c.amount} ${unitLabel(c.amount, c.unit)}`;
		}
		case "split":
			return step.config.title || `When ${step.config.path_a}`;
		case "action":
			return step.config.action || "Define action";
	}
};

export const triggerLabel = (trigger: TriggerConfig) =>
	trigger.title ||
	(trigger.event
		? trigger.category === "pipeline"
			? `Deal moves to ${trigger.event}`
			: trigger.event
		: "Choose a trigger");

export const countEmails = (steps: WorkflowStep[]): number =>
	steps.reduce(
		(n, s) =>
			n +
			(s.type === "email" ? 1 : 0) +
			(s.type === "split" ? countEmails(s.paths.a) + countEmails(s.paths.b) : 0),
		0,
	);

const welcomeSeries = () => ({
	name: "Welcome Email",
	trigger: createTrigger(),
	steps: [createStep("email"), createStep("delay")],
});

const WORKFLOW_CATEGORIES = [
	"Welcome & Lead Nurture",
	"Re-engagement",
	"Sales follow-up",
	"Onboarding",
	"Events",
	"Feedback & Reviews",
	"Win-back",
];

const TEMPLATE_DESCRIPTION =
	"Send personalized welcome messages and guide new subscribers to get the most value from your brand.";

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = WORKFLOW_CATEGORIES.flatMap(
	(category, c) =>
		Array.from({ length: c === 0 ? 9 : 3 }).map((_, i) => ({
			_id: `wf-${c}-${i}`,
			name: "Welcome (Events)",
			description: TEMPLATE_DESCRIPTION,
			category,
			build: welcomeSeries,
		})),
);

export const createAutomation = (
	from?: Pick<Automation, "name" | "trigger" | "steps">,
): Automation => ({
	_id: crypto.randomUUID(),
	name: from?.name ?? "Untitled automation",
	status: "draft",
	active: false,
	trigger: from?.trigger ?? createTrigger(),
	steps: from?.steps ?? [],
	audience: AUDIENCES[0],
	send_at: null,
	stats: { clicks: 0, sent: 0, opens: 0 },
	updated_at: new Date().toISOString(),
});

export const MOCK_AUTOMATIONS: Automation[] = [
	{
		...createAutomation({
			name: "Welcome Email Series",
			trigger: {
				title: "Subscriber subscribes",
				category: "bulk_email",
				group: "Newsletter sign up form",
				event: "User subscribes",
			},
			steps: welcomeSeries().steps,
		}),
		_id: "auto-1",
		status: "published",
		active: true,
		updated_at: "2026-10-24T10:42:00",
	},
];
