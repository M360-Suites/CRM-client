import { Extensions, Node, ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { SectionName } from "@/types/bulk_email";
import { DEFAULT_SECTION_STYLES, SECTION_NODES } from "./design";
import ImageView from "./image_view";
import ButtonView from "./button_view";

// The document is always exactly header, body, footer. The schema enforces
// it, so sections can't be deleted, only emptied.
const EmailDocument = Node.create({
	name: "doc",
	topNode: true,
	content: `${SECTION_NODES.header} ${SECTION_NODES.body} ${SECTION_NODES.footer}`,
});

const intAttr = (name: string, fallback: number) => ({
	default: fallback,
	parseHTML: (el: HTMLElement) => {
		const n = Number(el.getAttribute(name));
		return el.hasAttribute(name) && Number.isFinite(n) ? n : fallback;
	},
	renderHTML: () => ({}),
});

const Section = (section: SectionName) => {
	const defaults = DEFAULT_SECTION_STYLES[section];
	return Node.create({
		name: SECTION_NODES[section],
		content: "block+",
		defining: true,
		isolating: true,
		addAttributes() {
			return {
				background_color: {
					default: defaults.background_color,
					parseHTML: (el) => el.getAttribute("data-bg") || defaults.background_color,
					renderHTML: () => ({}),
				},
				text_color: {
					default: defaults.text_color,
					parseHTML: (el) => el.getAttribute("data-color") || defaults.text_color,
					renderHTML: () => ({}),
				},
				padding_y: intAttr("data-py", defaults.padding_y),
				padding_x: intAttr("data-px", defaults.padding_x),
			};
		},
		parseHTML() {
			return [{ tag: `section[data-email-section="${section}"]` }];
		},
		renderHTML({ node }) {
			const a = node.attrs;
			return [
				"section",
				{
					"data-email-section": section,
					"data-bg": a.background_color,
					"data-color": a.text_color,
					"data-py": a.padding_y,
					"data-px": a.padding_x,
					// Only for the editor canvas; the email renderer reads data-*
					style: `background:${a.background_color};color:${a.text_color};padding:${a.padding_y}px ${a.padding_x}px`,
				},
				0,
			];
		},
	});
};

export type ImageAlign = "left" | "center" | "right";

export interface EmailImageAttrs {
	src: string;
	alt: string;
	// px; null = full width of the section
	width: number | null;
	align: ImageAlign;
	href: string | null;
	radius: number;
	border_width: number;
	border_color: string;
}

export const EmailImage = Node.create({
	name: "emailImage",
	group: "block",
	atom: true,
	draggable: true,
	selectable: true,
	addAttributes() {
		return {
			src: { default: "" },
			alt: { default: "" },
			width: {
				default: null,
				parseHTML: (el) => {
					const n = Number(el.getAttribute("width"));
					return el.hasAttribute("width") && n > 0 ? n : null;
				},
			},
			align: {
				default: "center",
				parseHTML: (el) => el.getAttribute("data-align") || "center",
				renderHTML: (a) => ({ "data-align": a.align }),
			},
			href: {
				default: null,
				parseHTML: (el) => el.getAttribute("data-href") || null,
				renderHTML: (a) => (a.href ? { "data-href": a.href } : {}),
			},
			radius: {
				default: 0,
				parseHTML: (el) => Number(el.getAttribute("data-radius")) || 0,
				renderHTML: (a) => ({ "data-radius": a.radius }),
			},
			border_width: {
				default: 0,
				parseHTML: (el) => Number(el.getAttribute("data-border-width")) || 0,
				renderHTML: (a) => ({ "data-border-width": a.border_width }),
			},
			border_color: {
				default: "#E2E8F0",
				parseHTML: (el) => el.getAttribute("data-border-color") || "#E2E8F0",
				renderHTML: (a) => ({ "data-border-color": a.border_color }),
			},
		};
	},
	parseHTML() {
		// Also accept plain <img> from pasted HTML and older templates
		return [{ tag: "img[data-email-image]" }, { tag: "img[src]" }];
	},
	renderHTML({ HTMLAttributes }) {
		return ["img", mergeAttributes({ "data-email-image": "" }, HTMLAttributes)];
	},
	addNodeView() {
		return ReactNodeViewRenderer(ImageView);
	},
});

export interface EmailButtonAttrs {
	label: string;
	href: string;
	background: string;
	color: string;
	radius: number;
	align: ImageAlign;
	full_width: boolean;
}

export const EmailButton = Node.create({
	name: "emailButton",
	group: "block",
	atom: true,
	draggable: true,
	selectable: true,
	addAttributes() {
		const data = (name: string, fallback: string | number | boolean) => ({
			default: fallback,
			parseHTML: (el: HTMLElement) => {
				const v = el.getAttribute(`data-${name}`);
				if (v == null) return fallback;
				if (typeof fallback === "number") return Number(v) || fallback;
				if (typeof fallback === "boolean") return v === "true";
				return v;
			},
			renderHTML: (a: Record<string, unknown>) => ({ [`data-${name}`]: a[name.replace("-", "_")] }),
		});
		return {
			label: {
				default: "Click here",
				parseHTML: (el) => el.textContent?.trim() || "Click here",
				renderHTML: () => ({}),
			},
			href: {
				default: "https://",
				parseHTML: (el) => el.querySelector("a")?.getAttribute("href") || "https://",
				renderHTML: () => ({}),
			},
			background: data("background", "#0091FE"),
			color: data("color", "#FFFFFF"),
			radius: data("radius", 4),
			align: data("align", "left"),
			full_width: data("full-width", false),
		};
	},
	parseHTML() {
		return [{ tag: "div[data-email-button]" }];
	},
	renderHTML({ node, HTMLAttributes }) {
		return [
			"div",
			mergeAttributes({ "data-email-button": "" }, HTMLAttributes),
			["a", { href: node.attrs.href }, node.attrs.label],
		];
	},
	addNodeView() {
		return ReactNodeViewRenderer(ButtonView);
	},
});

export const emailExtensions = (): Extensions => [
	EmailDocument,
	Section("header"),
	Section("body"),
	Section("footer"),
	StarterKit.configure({
		document: false,
		codeBlock: false,
		// Would append paragraphs to the doc, which only holds the three sections
		trailingNode: false,
		heading: { levels: [1, 2, 3] },
		link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
		dropcursor: { color: "#0091FE", width: 3 },
	}),
	TextStyle,
	Color,
	FontSize,
	Highlight.configure({ multicolor: true }),
	TextAlign.configure({ types: ["heading", "paragraph"] }),
	EmailImage,
	EmailButton,
];
