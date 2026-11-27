import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "First email - Like Bellroy" (High Fidelity), with the branding removed
const TEAL = "#5E8F8B";
const INK = "#1F2A2A";

const menu = (items: string[], color: string) =>
	p(
		items.flatMap((item, i) => [
			...(i ? ["   ·   "] : []),
			link("https://", styled({ size: 12, color }, item.toUpperCase())),
		]),
		"center",
	);

const feature = (title: string, text: string, cta: string) => [
	h(2, title),
	p(text),
	button(cta, { background: INK, radius: 0 }),
];

export default starter({
	id: "product-spotlight",
	name: "Product Spotlight",
	description:
		"Put one collection in the spotlight: a bold hero, two image-and-text features and a closing call to action.",
	category: "library",
	style: {
		background_color: "#F4F6F6",
		content_background: "#FFFFFF",
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: TEAL,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 40,
		content: [
			menu(["Shop", "New in", "Bestsellers", "Gift ideas"], "#FFFFFF"),
			h(2, "Your Brand", "center"),
			img(placeholder("goods-hero"), "Collection photo"),
			h(1, styled({ size: 34 }, "More order, less stress"), "center"),
			p(
				"Introduce the collection in a sentence or two. Explain the everyday problem it solves and why your customers will love it.",
				"center",
			),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#334155",
		padding_y: 40,
		padding_x: 40,
		content: [
			columns(
				[
					[img(placeholder("goods-side"), "First product")],
					feature(
						"Made to go everywhere",
						"Describe the first product: what it's made of, what fits inside and what makes it last.",
						"Shop now",
					),
				],
				{ gap: 24, valign: "middle" },
			),
			columns(
				[
					feature(
						"Small details, big difference",
						"Use this space for a second product, or for the story behind how your products are made.",
						"Learn more",
					),
					[img(placeholder("goods-side"), "Second product")],
				],
				{ gap: 24, valign: "middle" },
			),
			img(placeholder("goods-wide"), "Lifestyle photo"),
			h(2, "Find the one that fits your day", "center"),
			button("Explore the collection", { background: TEAL, radius: 0, align: "center" }),
		],
	},
	footer: {
		background_color: "#EEF3F2",
		text_color: "#475569",
		padding_y: 32,
		padding_x: 40,
		content: [
			menu(["Instagram", "Facebook", "YouTube"], INK),
			p(
				styled({ size: 13 }, [bold("Your Company Ltd."), " · Street address, City, Postcode"]),
				"center",
			),
			menu(["Help", "Returns", "Store finder"], "#475569"),
		],
	},
});
