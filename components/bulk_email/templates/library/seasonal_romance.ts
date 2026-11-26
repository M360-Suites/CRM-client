import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Fourth email - Like Birdies" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const RED = "#AF182B";
const GOLD = "#C7A365";
const INK = "#0E0E0E";

const pick = (alt: string) => [img(placeholder("fashion-grid"), alt), p(link("https://", bold("Shop now")), "center")];
const category = (name: string) => [img(placeholder("fashion-grid"), name), p(link("https://", bold(name)), "center")];

export default starter({
	id: "seasonal-romance",
	name: "Red-y to Fall in Love",
	description:
		"A seasonal edit with three picks, then a gold sale band and a six-tile grid of categories to shop.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#FFFFFF",
		content_width: 520,
		font_family: FONTS.modern,
		link_color: INK,
	},
	header: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 48,
		padding_x: 0,
		content: [
			p(bold(styled({ size: 22 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 56, color: RED }, "red-y to fall in love?"), "center"),
			img(placeholder("fashion-hero"), "Red styles"),
			p(
				styled(
					{ size: 18 },
					"Get swept into the season of romance by red-hot styles that stand out, turn heads, and feel like a dream made to last.",
				),
				"center",
			),
			button("SHOP NOW", { background: INK, radius: 0, align: "center" }),
			p(),
			p(bold(styled({ color: RED }, "A HUG FOR YOUR FEET")), "center"),
			columns([pick("Style one"), pick("Style two"), pick("Style three")], { gap: 16 }),
		],
	},
	body: {
		background_color: GOLD,
		text_color: "#FFFFFF",
		padding_y: 40,
		padding_x: 24,
		content: [
			h(1, styled({ size: 104 }, "Sale"), "center"),
			p(styled({ size: 28 }, "50% OFF EVERYTHING"), "center"),
			p(styled({ size: 18 }, "Your faves won’t last. Shop before they’re gone!"), "center"),
			button("SHOP NOW", { background: "#FFFFFF", color: "#9D7848", radius: 0, align: "center" }),
		],
	},
	footer: {
		...fashionFooter(),
		padding_x: 0,
		content: [
			columns([category("NEW ARRIVALS"), category("BALLET FLATS")], { gap: 16 }),
			columns([category("LOAFERS"), category("BOOTS")], { gap: 16 }),
			columns([category("HEELS"), category("SALE")], { gap: 16 }),
			p(),
			...fashionFooter().content,
		],
	},
});
