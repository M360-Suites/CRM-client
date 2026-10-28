export type BulkEmailStatus = "draft" | "scheduled" | "published";

export type BulkEmailAudience = "hot" | "warm" | "cold" | "all";

export type TemplateCategory = "starting" | "classic" | "library";

export interface EmailImageSettings {
	url: string;
	alt: string;
	link: string;
	show_caption: boolean;
	caption: string;
	width_mode: "fixed" | "full";
	width: number;
	crop: "none" | "square";
	radius: "none" | "curved" | "round" | "custom";
	radius_px: number;
	align: "left" | "center" | "right";
	border_color: string;
	border_width: "none" | "normal" | "large" | "custom";
	border_px: number;
	wrap_text: boolean;
	optimize: boolean;
	margin: number;
}

export interface EmailContent {
	background_color: string;
	button_text_color: string;
	button_background_color: string;
	image: EmailImageSettings;
	html: string;
}

export interface EmailTemplate {
	_id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	content: EmailContent;
	updated_at: string;
}

export interface BulkEmail {
	_id: string;
	title: string;
	subject: string;
	preview_text: string;
	audience: BulkEmailAudience;
	status: BulkEmailStatus;
	template_id: string | null;
	ab_test: boolean;
	content: EmailContent;
	updated_at: string;
	updated_by: string;
}
