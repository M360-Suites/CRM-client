import { EmailDesign, SectionStyle, TemplateCategory } from "@/types/bulk_email";
import { DEFAULT_SECTION_STYLES, FONT_OPTIONS, LAYOUT_REV, SECTION_NODES } from "../../email_editor/design";
import { ColumnsAlign } from "../../email_editor/columns";
import { ImageAlign } from "../../email_editor/extensions";

// Small builders for the editor's document format, so each starter template
// reads like the email it describes. Everything they produce is ordinary
// editor content: every heading, image, button and column stays editable.

type Mark = { type: string; attrs?: Record<string, unknown> };
export type Inline = { type: "text"; text: string; marks?: Mark[] } | { type: "hardBreak" };
export type Block = Record<string, unknown>;
export type Content = string | Inline | Content[];
type Align = "left" | "center" | "right";

const inline = (c: Content): Inline[] =>
	Array.isArray(c)
		? c.flatMap(inline)
		: [typeof c === "string" ? { type: "text", text: c } : c];

const withMark = (mark: Mark, c: Content): Inline[] =>
	inline(c).map((x) => (x.type === "text" ? { ...x, marks: [...(x.marks ?? []), mark] } : x));

// Inline styling
export const bold = (c: Content) => withMark({ type: "bold" }, c);
export const italic = (c: Content) => withMark({ type: "italic" }, c);
export const underline = (c: Content) => withMark({ type: "underline" }, c);
export const link = (href: string, c: Content) => withMark({ type: "link", attrs: { href } }, c);
export const styled = (style: { color?: string; size?: number }, c: Content) =>
	withMark(
		{
			type: "textStyle",
			attrs: {
				color: style.color ?? null,
				fontSize: style.size ? `${style.size}px` : null,
			},
		},
		c,
	);
export const br: Inline = { type: "hardBreak" };

const alignAttrs = (align?: Align) => (align ? { attrs: { textAlign: align } } : {});

export const p = (c: Content = "", align?: Align): Block => ({
	type: "paragraph",
	...alignAttrs(align),
	content: c === "" ? [] : inline(c),
});

export const h = (level: 1 | 2 | 3, c: Content, align?: Align): Block => ({
	type: "heading",
	attrs: { level, ...(align ? { textAlign: align } : {}) },
	content: inline(c),
});

export const ul = (items: Content[]): Block => ({
	type: "bulletList",
	content: items.map((i) => ({ type: "listItem", content: [p(i)] })),
});

export const hr = (): Block => ({ type: "horizontalRule" });

export const img = (
	src: string,
	alt: string,
	opts: { width?: number; align?: ImageAlign; radius?: number; href?: string } = {},
): Block => ({
	type: "emailImage",
	attrs: {
		src,
		alt,
		width: opts.width ?? null,
		align: opts.align ?? "center",
		href: opts.href ?? null,
		radius: opts.radius ?? 0,
	},
});

export const button = (
	label: string,
	opts: {
		background: string;
		color?: string;
		radius?: number;
		align?: ImageAlign;
		full?: boolean;
		href?: string;
	},
): Block => ({
	type: "emailButton",
	attrs: {
		label,
		href: opts.href ?? "https://",
		background: opts.background,
		color: opts.color ?? "#FFFFFF",
		radius: opts.radius ?? 4,
		align: opts.align ?? "left",
		full_width: !!opts.full,
	},
});

export const columns = (
	cols: Block[][],
	opts: { gap?: number; valign?: ColumnsAlign } = {},
): Block => ({
	type: "emailColumns",
	attrs: { gap: opts.gap ?? 16, valign: opts.valign ?? "top" },
	content: cols.map((content) => ({ type: "emailColumn", content })),
});

// A placeholder picture from public/assets/templates
export const placeholder = (name: string) => `/assets/templates/${name}.png`;

export type SectionInput = Partial<SectionStyle> & { content: Block[] };

const section = (name: "header" | "body" | "footer", s: SectionInput) => {
	const { content, ...style } = s;
	return {
		type: SECTION_NODES[name],
		attrs: { ...DEFAULT_SECTION_STYLES[name], ...style },
		// A section can't be empty in the editor's schema
		content: content.length ? content : [p()],
	};
};

export const FONTS = {
	sans: FONT_OPTIONS[0].value,
	modern: FONT_OPTIONS[1].value,
	serif: FONT_OPTIONS[2].value,
};

export interface StarterInput {
	id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	style?: Partial<Omit<EmailDesign, "version" | "doc" | "layout_rev">>;
	header: SectionInput;
	body: SectionInput;
	footer: SectionInput;
}

export const starter = (t: StarterInput) => ({
	_id: `lib-${t.id}`,
	name: t.name,
	description: t.description,
	category: t.category,
	design: {
		version: 2 as const,
		background_color: "#EEF2F6",
		content_background: "#FFFFFF",
		content_width: 600,
		content_radius: 0,
		font_family: FONTS.sans,
		link_color: "#0091FE",
		...t.style,
		layout_rev: LAYOUT_REV,
		doc: {
			type: "doc" as const,
			content: [section("header", t.header), section("body", t.body), section("footer", t.footer)],
		},
	},
});
