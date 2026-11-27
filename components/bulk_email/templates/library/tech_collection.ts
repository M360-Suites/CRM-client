import { FONTS, bold, button, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { goodsFooter, linkRow } from "./footers";

// Figma: "Second email - Like Bellroy" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const ORANGE = "#F34D01";
const TEAL = "#1E4344";
const DARK = "#333436";

const product = (tag: string, name: string, text: string) => [
	img(placeholder("goods-wide"), name),
	p(bold(styled({ size: 12, color: ORANGE }, tag))),
	p(bold(styled({ size: 18 }, name))),
	p(text),
	p(link("https://", bold(styled({ size: 12, color: ORANGE }, "SHOP NOW")))),
	p(),
];

export default starter({
	id: "tech-collection",
	name: "Tech Collection",
	description:
		"Launch a collection: menu links, a big hero, three products each with a photo, tag and shop link, and a dark closing band.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: DARK,
	},
	header: {
		background_color: TEAL,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 24,
		content: [
			linkRow(["WALLETS", "BAGS", "ACCESSORIES", "NEW RELEASES"], 11),
			p(bold(styled({ size: 24 }, "YOUR BRAND")), "center"),
			img(placeholder("goods-hero"), "Tech collection"),
			h(1, styled({ size: 64 }, "Pro Tech Ted"), "center"),
			p(
				styled(
					{ size: 18 },
					"Wrap your tech in tailored designs that offer slim protection and subtle sophistication.",
				),
				"center",
			),
			button("SHOP TECH COLLECTION", { background: ORANGE, radius: 8, align: "center" }),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: DARK,
		padding_y: 24,
		padding_x: 24,
		content: [
			...product(
				"for Iphone 16",
				"MOD PHONE CASE + WALLET",
				"This dynamic duo lets you snap a slim wallet securely onto your phone case when you need it, then pop it off when you don’t.",
			),
			...product(
				"WATERPROOF",
				"VENTURE WATCH STRAP",
				"Robust and waterproof, sporty yet refined. This band equips your Apple Watch for both outdoor adventure and days in the office.",
			),
			...product(
				"FULLY ENCLOSED SHELL",
				"TAG CASE",
				"This case keeps your AirTag secured and protected, in an impressively slim design with a smooth leather finish.",
			),
		],
	},
	footer: {
		...goodsFooter(),
		background_color: DARK,
		text_color: "#FFFFFF",
		content: [
			img(placeholder("goods-side"), "More tech accessories"),
			h(1, styled({ size: 44 }, "Find your next fave"), "center"),
			button("TO PROTECT YOUR TECH", { background: ORANGE, radius: 8, align: "center" }),
			p(),
			...goodsFooter().content,
		],
	},
});
