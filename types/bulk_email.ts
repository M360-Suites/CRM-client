// ---- Editor design (stored as `design` JSON on templates and broadcasts) ----

export type TemplateCategory = "starting" | "classic" | "library";

export type SectionName = "header" | "body" | "footer";

// Styles each section carries as attributes on its node in the document
export interface SectionStyle {
	background_color: string;
	text_color: string;
	padding_y: number;
	padding_x: number;
}

// A Tiptap/ProseMirror document: { type: "doc", content: [header, body, footer] }
export interface EmailDoc {
	type: "doc";
	content?: unknown[];
}

export interface EmailDesign {
	version: 2;
	doc: EmailDoc;
	// Area around the email
	background_color: string;
	// The email card
	content_background: string;
	content_width: number;
	content_radius: number;
	font_family: string;
	link_color: string;
	// One-time fixes applied when the design was opened (see loadDesign)
	layout_rev?: number;
}

// Version 1 designs (single header image + body + footer fields). Only read,
// to convert templates and drafts saved before the section editor.
export interface LegacyImageSettings {
	url: string;
	alt: string;
	link: string;
	width_mode: "fixed" | "full";
	width: number;
	radius: "none" | "curved" | "round" | "custom";
	radius_px: number;
	align: "left" | "center" | "right";
	border_color?: string;
	border_width?: "none" | "normal" | "large" | "custom";
	border_px?: number;
}

export interface LegacyEmailContent {
	background_color: string;
	button_text_color?: string;
	button_background_color?: string;
	show_image?: boolean;
	image: LegacyImageSettings;
	html: string;
	footer?: { company: string; address: string; note: string };
}

// Built-in starter designs on "Choose a template to customize" (client only)
export interface StarterTemplate {
	_id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	design: EmailDesign;
}

// ---- API: /email-templates ----

export interface EmailTemplate {
	_id: string;
	name: string;
	subject: string;
	preview_text?: string;
	// Only returned by GET /email-templates/{id}
	html?: string;
	// EmailDesign, or a legacy/unknown shape for older records
	design?: unknown;
	created_at?: string;
	updated_at?: string;
}

export interface EmailTemplatePayload {
	name?: string;
	subject?: string;
	preview_text?: string;
	html?: string;
	design?: EmailDesign;
}

export interface MergeVariable {
	tag: string;
	label: string;
}

// ---- API: /broadcasts ----

export type BroadcastStatus =
	| "draft"
	| "scheduled"
	| "sending"
	| "sent"
	| "cancelled"
	| "failed";

export type ContactTemperature = "hot" | "warm" | "cold";

export interface BroadcastAudience {
	all?: boolean;
	tags?: string[];
	temperature?: ContactTemperature[];
	owner_ids?: string[];
	company_ids?: string[];
	contact_ids?: string[];
}

export interface BroadcastStats {
	total?: number;
	sent?: number;
	failed?: number;
	bounced?: number;
	complained?: number;
	skipped?: number;
}

export interface PersonRef {
	id?: string;
	display_name?: string | null;
}

// The API's ID field is `id`; services copy it to `_id`, which the UI reads.
export interface Broadcast {
	_id: string;
	name: string;
	subject?: string | null;
	preview_text?: string | null;
	// html and design only come back on GET /broadcasts/{id}, POST and PATCH
	html?: string | null;
	// EmailDesign, or a legacy/unknown shape for older records
	design?: unknown;
	template_id?: string | null;
	audience?: BroadcastAudience;
	status: BroadcastStatus;
	scheduled_at?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
	stats?: BroadcastStats;
	error?: string | null;
	created_by?: PersonRef | null;
	sent_by?: PersonRef | null;
	created_at?: string;
	updated_at?: string;
}

export interface BroadcastPayload {
	name?: string;
	template_id?: string | null;
	subject?: string;
	preview_text?: string | null;
	html?: string;
	design?: EmailDesign | null;
	audience?: BroadcastAudience;
}

export interface AudiencePreview {
	count: number;
	// Contacts the audience matches who unsubscribed, bounced or complained
	opted_out: number;
	sample: { id?: string; name?: string | null; email?: string | null }[];
}

export type RecipientStatus =
	| "queued"
	| "sending"
	| "sent"
	| "failed"
	| "bounced"
	| "complained"
	| "skipped";

export interface BroadcastRecipient {
	_id: string;
	contact_id?: string | null;
	name?: string | null;
	email?: string | null;
	status: RecipientStatus;
	error?: string | null;
	sent_at?: string | null;
}

export interface TestSendResult {
	sent_to?: string[];
}

// ---- API: /email-suppressions ----

export type SuppressionReason = "unsubscribed" | "bounced" | "complained";

export interface Suppression {
	contact_id: string;
	name?: string | null;
	email?: string | null;
	reason?: SuppressionReason | null;
	suppressed_at?: string | null;
}

export type SuppressionCounts = Record<SuppressionReason, number>;

// ---- API: /email-images ----

export interface UploadedEmailImage {
	url: string;
	public_id?: string;
	width?: number | null;
	height?: number | null;
}

export interface Paginated<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
	total_pages: number;
}

export interface SuppressionPage extends Paginated<Suppression> {
	counts: SuppressionCounts;
}
