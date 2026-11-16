import {
	BroadcastAudience,
	BroadcastStatus,
	ContactTemperature,
	RecipientStatus,
	StarterTemplate,
	TemplateCategory,
} from "@/types/bulk_email";

import { createDefaultDesign } from "./email_editor/design";

// Defaults, labels and the built-in starter designs for the bulk email screens.

// Contact temperature badge colours (contacts list, Add Contacts modal)
export const TEMPERATURE_STYLES: Record<ContactTemperature, string> = {
	hot: "bg-[#0091FE] text-white",
	warm: "bg-[#00B3A6] text-white",
	cold: "bg-[#94A3B8] text-white",
};

const TEMPERATURE_LABELS: Record<ContactTemperature, string> = {
	hot: "Hot",
	warm: "Warm",
	cold: "Cold",
};

export const isAllContacts = (audience?: BroadcastAudience) =>
	!audience || (!!audience.all && !audience.contact_ids?.length);

// Who a broadcast goes to, in a few words. Audiences are "all contacts" or a
// picked list; older broadcasts may have been saved with a temperature group.
export const audienceSummary = (audience?: BroadcastAudience) => {
	if (audience?.contact_ids?.length) {
		const n = audience.contact_ids.length;
		return { label: `${n} ${n === 1 ? "contact" : "contacts"}`, style: "bg-[#0091FE] text-white" };
	}
	if (isAllContacts(audience)) return { label: "All contacts", style: "bg-[#FBBF24] text-white" };
	const temps = audience?.temperature ?? [];
	if (temps.length === 1) {
		return { label: `${TEMPERATURE_LABELS[temps[0]]} contacts`, style: TEMPERATURE_STYLES[temps[0]] };
	}
	return { label: "Custom", style: "bg-[#64748B] text-white" };
};

export const STATUS_STYLES: Record<BroadcastStatus, string> = {
	draft: "bg-[#F1F5F9] text-[#334155]",
	scheduled: "bg-[#EFF6FF] text-[#1D4ED8]",
	sending: "bg-[#FFFBEB] text-[#B45309]",
	sent: "bg-[#ECFDF5] text-[#059669]",
	cancelled: "bg-[#F1F5F9] text-[#64748B]",
	failed: "bg-[#FEF2F2] text-[#DC2626]",
};

// Only these can still be edited (PATCH) on the backend
export const EDITABLE_STATUSES: BroadcastStatus[] = ["draft", "scheduled"];

export const RECIPIENT_STATUS_STYLES: Record<RecipientStatus, string> = {
	queued: "bg-[#F1F5F9] text-[#334155]",
	sending: "bg-[#FFFBEB] text-[#B45309]",
	sent: "bg-[#ECFDF5] text-[#059669]",
	failed: "bg-[#FEF2F2] text-[#DC2626]",
	bounced: "bg-[#FEF2F2] text-[#DC2626]",
	complained: "bg-[#FFF7ED] text-[#C2410C]",
	skipped: "bg-[#F1F5F9] text-[#64748B]",
};

export const TEMPLATE_CATEGORIES: {
	value: TemplateCategory;
	label: string;
	isNew?: boolean;
	heading: string;
	description: string;
}[] = [
	{
		value: "starting",
		label: "Starting points",
		isNew: true,
		heading: "Starting points",
		description:
			"With starting points you can save customized designs and default content for your future emails. These templates give you access to the latest version of our email editor.",
	},
	{
		value: "classic",
		label: "Classic templates",
		heading: "Classic templates",
		description:
			"They are supported everywhere in CRM360 but offer less customization options.",
	},
	{
		value: "library",
		label: "Template library",
		isNew: true,
		heading: "Templates Library",
		description:
			"With starting points you can save customized designs and default content for your future emails. These templates give you access to the latest version of our email editor.",
	},
];

const TEMPLATE_DESCRIPTION =
	"Send personalized welcome messages and guide new subscribers to get the most value from your brand.";

// Starter designs shown in "Choose a template to customize". Picking one
// creates a real template from it through the API.
export const LIBRARY_TEMPLATES: StarterTemplate[] = (
	["starting", "classic", "library"] as TemplateCategory[]
).flatMap((category) =>
	Array.from({ length: 9 }).map((_, i) => ({
		_id: `lib-${category}-${i + 1}`,
		name: "Welcome (Events)",
		description: TEMPLATE_DESCRIPTION,
		category,
		design: createDefaultDesign(),
	})),
);

export const personName = (
	p?: {
		display_name?: string | null;
		first_name?: string;
		last_name?: string;
		name?: string | null;
		email?: string | null;
	} | null,
) => {
	if (!p) return "";
	return (
		p.display_name ||
		p.name ||
		[p.first_name, p.last_name].filter(Boolean).join(" ") ||
		p.email ||
		""
	);
};
