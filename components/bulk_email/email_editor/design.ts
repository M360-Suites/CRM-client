import { bodyFromHtml, extractDesign } from "@/lib/email_html";
import {
	EmailDesign,
	EmailDoc,
	LegacyEmailContent,
	SectionName,
	SectionStyle,
} from "@/types/bulk_email";

// Node type names in the editor's schema
export const SECTION_NODES: Record<SectionName, string> = {
	header: "emailHeader",
	body: "emailBody",
	footer: "emailFooter",
};

export const SECTION_LABELS: Record<SectionName, string> = {
	header: "Header",
	body: "Body",
	footer: "Footer",
};

export const DEFAULT_SECTION_STYLES: Record<SectionName, SectionStyle> = {
	// Transparent until edited, so the header shows the email's own background
	// Same side spacing as the body so header content lines up with it
	header: { background_color: "transparent", text_color: "#0F172A", padding_y: 24, padding_x: 40 },
	body: { background_color: "#FFFFFF", text_color: "#334155", padding_y: 32, padding_x: 40 },
	footer: { background_color: "#F1F5F9", text_color: "#64748B", padding_y: 24, padding_x: 40 },
};

export const FONT_OPTIONS = [
	{ label: "Sans serif", value: "Arial, Helvetica, sans-serif" },
	{ label: "Modern", value: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
	{ label: "Serif", value: "Georgia, 'Times New Roman', serif" },
	{ label: "Mono", value: "Menlo, Consolas, monospace" },
];

export const DEFAULT_TEMPLATE_NAME = "Monterey";

const text = (t: string, marks?: unknown[]) => ({ type: "text", text: t, ...(marks ? { marks } : {}) });
const p = (t: string, attrs?: Record<string, unknown>) => ({
	type: "paragraph",
	...(attrs ? { attrs } : {}),
	content: t ? [text(t)] : [],
});

const defaultDoc = (): EmailDoc => ({
	type: "doc",
	content: [
		{
			type: SECTION_NODES.header,
			attrs: DEFAULT_SECTION_STYLES.header,
			content: [
				{
					type: "emailImage",
					attrs: { src: "/assets/bulk-email-hero.jpg", alt: "Header image", width: null, align: "center" },
				},
			],
		},
		{
			type: SECTION_NODES.body,
			attrs: DEFAULT_SECTION_STYLES.body,
			content: [
				{ type: "heading", attrs: { level: 2 }, content: [text("Exploring Monterey")] },
				p("Hi {{contact.first_name}}, write the heart of your message here. Select text to change its color or highlight it, and drag images by their handle to move them between sections."),
				{
					type: "emailButton",
					attrs: { label: "Click here", href: "https://", background: "#0091FE", color: "#FFFFFF", radius: 4, align: "left" },
				},
				p("Thanks for reading."),
			],
		},
		{
			type: SECTION_NODES.footer,
			attrs: DEFAULT_SECTION_STYLES.footer,
			content: [
				p("Your company name", { textAlign: "center" }),
				p("Street address, City, Country", { textAlign: "center" }),
			],
		},
	],
});

export const createDefaultDesign = (): EmailDesign => ({
	version: 2,
	doc: defaultDoc(),
	background_color: "#EEF2F6",
	content_background: "#FFFFFF",
	content_width: 600,
	content_radius: 8,
	font_family: FONT_OPTIONS[0].value,
	link_color: "#0091FE",
	layout_rev: LAYOUT_REV,
});

// What the editor starts from: a stored document, or HTML it parses
// (used to convert records saved before the section editor).
export interface LoadedDesign {
	design: EmailDesign;
	initial: EmailDoc | string;
	// True when loading converted or fixed the stored design, so the editor
	// saves it straight away instead of waiting for the first edit
	changed?: boolean;
}

const isDesign = (v: unknown): v is EmailDesign =>
	!!v && typeof v === "object" && (v as EmailDesign).version === 2 && !!(v as EmailDesign).doc;

const isLegacy = (v: unknown): v is LegacyEmailContent =>
	!!v &&
	typeof v === "object" &&
	typeof (v as LegacyEmailContent).html === "string" &&
	!!(v as LegacyEmailContent).image;

const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const hex = (c?: string) => (!c ? undefined : c.startsWith("#") ? c : `#${c}`);

const sectionHtml = (name: SectionName, style: SectionStyle, inner: string) =>
	`<section data-email-section="${name}" data-bg="${style.background_color}" data-color="${style.text_color}" data-py="${style.padding_y}" data-px="${style.padding_x}">${inner || "<p></p>"}</section>`;

const legacyToHtml = (legacy: LegacyEmailContent) => {
	const img = legacy.image;
	const headerInner =
		legacy.show_image !== false && img?.url
			? `<img data-email-image src="${attr(img.url)}" alt="${attr(img.alt ?? "")}"${
					img.width_mode === "fixed" ? ` width="${img.width}"` : ""
				} data-align="${img.align ?? "center"}"${img.link ? ` data-href="${attr(img.link)}"` : ""} />`
			: "";
	const footer = legacy.footer;
	const footerInner = footer
		? [footer.company, footer.address, footer.note]
				.filter((l) => l?.trim())
				.map((l) => `<p style="text-align: center">${escText(l)}</p>`)
				.join("")
		: "";
	return (
		sectionHtml("header", DEFAULT_SECTION_STYLES.header, headerInner) +
		sectionHtml("body", DEFAULT_SECTION_STYLES.body, legacy.html) +
		sectionHtml("footer", DEFAULT_SECTION_STYLES.footer, footerInner)
	);
};

const htmlOnly = (html: string) =>
	sectionHtml("header", DEFAULT_SECTION_STYLES.header, "") +
	sectionHtml("body", DEFAULT_SECTION_STYLES.body, bodyFromHtml(html)) +
	sectionHtml("footer", DEFAULT_SECTION_STYLES.footer, "");

// Bumped when a one-time fix is added below; saved with the design so each
// fix runs once and never overrides later edits.
export const LAYOUT_REV = 1;

const same = (x: unknown, y: unknown) => String(x).toUpperCase() === String(y).toUpperCase();

// The first section-editor version gave the header no spacing and either the
// default blue or, for converted templates, the old template's background
// (also used as the page color), with white text. A header still in that
// state was never styled by hand, so it gets the current header defaults.
const upgradeHeader = (doc: EmailDoc, pageColor: string): EmailDoc => {
	const [header, ...rest] = (doc.content ?? []) as { type?: string; attrs?: Record<string, unknown> }[];
	const a = header?.attrs;
	if (header?.type !== SECTION_NODES.header || !a) return doc;
	if (Number(a.padding_x) !== 0 || Number(a.padding_y) !== 0) return doc;
	const autoBackground = same(a.background_color, "#0091FE") || same(a.background_color, pageColor);
	const defaults = DEFAULT_SECTION_STYLES.header;
	const attrs = {
		...a,
		padding_x: defaults.padding_x,
		padding_y: defaults.padding_y,
		...(autoBackground ? { background_color: defaults.background_color } : {}),
		...(autoBackground && same(a.text_color, "#FFFFFF") ? { text_color: defaults.text_color } : {}),
	};
	return { ...doc, content: [{ ...header, attrs }, ...rest] };
};

// Rebuild the editor's starting point from what the API stored
export const loadDesign = (record?: {
	design?: unknown;
	html?: string | null;
}): LoadedDesign => {
	const base = createDefaultDesign();
	const stored = record?.design ?? extractDesign(record?.html);
	if (isDesign(stored)) {
		const doc =
			(stored.layout_rev ?? 0) < 1
				? upgradeHeader(stored.doc, stored.background_color ?? base.background_color)
				: stored.doc;
		return {
			design: { ...base, ...stored, doc, layout_rev: LAYOUT_REV },
			initial: doc,
			changed: doc !== stored.doc || stored.layout_rev !== LAYOUT_REV,
		};
	}
	if (isLegacy(stored)) {
		return {
			design: { ...base, background_color: hex(stored.background_color) ?? base.background_color },
			initial: legacyToHtml(stored),
		};
	}
	if (record?.html) return { design: base, initial: htmlOnly(record.html) };
	return { design: base, initial: base.doc };
};
