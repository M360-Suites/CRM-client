import {
	BulkEmail,
	BulkEmailAudience,
	BulkEmailStatus,
	EmailContent,
	EmailTemplate,
	TemplateCategory,
} from "@/types/bulk_email";

// Placeholder data for the bulk email UI. Everything here lives in the client
// store until the bulk email endpoints exist.

export const DEFAULT_EMAIL_HTML = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultrices vehicula erat, eu faucibus ligula viverra sit amet. Nullam porta scelerisque lacus eu dignissim. Curabitur mattis dui est, sed gravida ex tincidunt sed.</p>
<h2>Exploring Monterey</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultrices vehicula erat, eu faucibus ligula viverra sit amet.</p>
<p><a class="cta" href="#">Click here</a></p>
<p>Duis vel dui in elit tristique mattis ut vel nisl. Nam sit amet euismod sapien, sed auctor eros. Morbi aliquet lobortis tellus, sit amet ullamcorper purus egestas non. Morbi nec massa lacus. Sed blandit tincidunt dui sit amet fermentum. Donec vehicula feugiat pretium.</p>`;

export const createDefaultContent = (): EmailContent => ({
	background_color: "218B95",
	button_text_color: "FFFFFF",
	button_background_color: "0F6973",
	html: DEFAULT_EMAIL_HTML,
	image: {
		url: "",
		alt: "Header Image",
		link: "",
		show_caption: false,
		caption: "",
		width_mode: "full",
		width: 100,
		crop: "original",
		radius: "none",
		align: "center",
		border_color: "000000",
		border_width: "none",
		wrap_text: false,
		optimize: true,
		margin: 0,
	},
});

export const AUDIENCE_LABELS: Record<BulkEmailAudience, string> = {
	hot: "Hot",
	warm: "Warm",
	cold: "Cold",
	all: "All Contacts",
};

export const AUDIENCE_STYLES: Record<BulkEmailAudience, string> = {
	hot: "bg-[#0091FE] text-white",
	warm: "bg-[#00B3A6] text-white",
	cold: "bg-[#94A3B8] text-white",
	all: "bg-[#FBBF24] text-white",
};

export const STATUS_STYLES: Record<BulkEmailStatus, string> = {
	draft: "bg-[#F1F5F9] text-[#334155]",
	scheduled: "bg-[#F1F5F9] text-[#0F172A]",
	published: "bg-[#ECFDF5] text-[#059669]",
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

const minutesAgo = (mins: number) =>
	new Date(Date.now() - mins * 60_000).toISOString();

const TEMPLATE_DESCRIPTION =
	"Send personalized welcome messages and guide new subscribers to get the most value from your brand.";

// Starter designs shown in "Choose a template to customize".
export const LIBRARY_TEMPLATES: EmailTemplate[] = (
	["starting", "classic", "library"] as TemplateCategory[]
).flatMap((category) =>
	Array.from({ length: 9 }).map((_, i) => ({
		_id: `lib-${category}-${i + 1}`,
		name: "Welcome (Events)",
		description: TEMPLATE_DESCRIPTION,
		category,
		content: createDefaultContent(),
		updated_at: minutesAgo(60 * (i + 1)),
	})),
);

// The organisation's saved templates shown on the Email Templates page.
export const MOCK_TEMPLATES: EmailTemplate[] = Array.from({ length: 12 }).map(
	(_, i) => ({
		_id: `tpl-${i + 1}`,
		name: "Welcome (Events)",
		description: TEMPLATE_DESCRIPTION,
		category: "starting",
		content: createDefaultContent(),
		updated_at: minutesAgo(60 * (i + 1)),
	}),
);

const MOCK_ROWS: [BulkEmailAudience, BulkEmailStatus][] = [
	["hot", "draft"],
	["warm", "draft"],
	["cold", "scheduled"],
	["all", "published"],
	["hot", "draft"],
	["warm", "draft"],
	["cold", "scheduled"],
	["all", "published"],
	["cold", "scheduled"],
	["all", "published"],
];

export const MOCK_EMAILS: BulkEmail[] = [...MOCK_ROWS, ...MOCK_ROWS].map(
	([audience, status], i) => ({
		_id: `email-${i + 1}`,
		title: "Q3 Enterprise Product Announcement",
		subject: "Unlock 3x pipeline velocity with CRM360 2.0",
		preview_text: "",
		audience,
		status,
		template_id: null,
		ab_test: false,
		content: createDefaultContent(),
		updated_at: minutesAgo(12 + i),
		updated_by: "Sarah C.",
	}),
);
