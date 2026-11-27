import { FONTS, bold, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Seventh email - Like Birdies" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const INK = "#0E0E0E";

const trend = (name: string) => [img(placeholder("fashion-grid"), name), p(link("https://", bold(name)), "center")];

export default starter({
	id: "season-trends",
	name: "Spring Trends",
	description:
		"Round up the season's trends in a six-tile grid, then reassure buyers with a dark band about shipping and returns.",
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
			h(1, styled({ size: 72 }, ["spring", br, "2025 trends"]), "center"),
			p(
				styled(
					{ size: 18 },
					"Fresh from the catwalk, these shoe trends are set to be everywhere this spring. See what's on our radar - and in our carts - for the season ahead.",
				),
				"center",
			),
			button("SHOP NOW", { background: INK, radius: 0, align: "center" }),
			p(),
			columns([trend("LEOPARD PRINT"), trend("WOVEN STYLES")]),
			columns([trend("MARY JANES"), trend("SLINGBAGS")]),
			columns([trend("PATENT LEATHER"), trend("MESH")]),
		],
	},
	body: {
		background_color: INK,
		text_color: "#FFFFFF",
		padding_y: 40,
		padding_x: 48,
		content: [
			p(bold("NO RISK, ALL REWARD"), "center"),
			p(
				styled(
					{ size: 18 },
					"Free shipping on orders over $85 and free returns. Plus our 30-day fit guarantee so you can make sure your new pair is just right.",
				),
				"center",
			),
			button("SHOP NOW", { background: "#FFFFFF", color: INK, radius: 0, align: "center" }),
		],
	},
	footer: fashionFooter(),
});
