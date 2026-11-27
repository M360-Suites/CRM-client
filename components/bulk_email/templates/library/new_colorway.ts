import { FONTS, bold, button, h, img, p, placeholder, starter, styled } from "./nodes";
import { goodsFooter, linkRow } from "./footers";

// Figma: "Fourth email - Like Bellroy" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const ORANGE = "#F34D01";
const BLACK = "#171717";

export default starter({
	id: "new-colorway",
	name: "New Colorway",
	description:
		"A dark, moody launch for a new colour: headline and button, two large photos and a designer's quote.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: BLACK,
		font_family: FONTS.modern,
		link_color: "#FFFFFF",
	},
	header: {
		background_color: BLACK,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 24,
		content: [
			linkRow(["WALLETS", "BAGS", "ACCESSORIES", "NEW RELEASES"], 11),
			p(bold(styled({ size: 24 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 48 }, "Strong, dark and handsome"), "center"),
			p(
				styled(
					{ size: 18 },
					"Our new Obsidian wallets are anything but precious. This colorway is strong. Rugged. With a prominent textural grain that balances tradition and expression. Ready to feel the dark?",
				),
				"center",
			),
			button("SHOP OBSIDIAN RANGE", { background: ORANGE, radius: 8, align: "center" }),
		],
	},
	body: {
		background_color: BLACK,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 24,
		content: [
			img(placeholder("goods-wide"), "Obsidian wallet"),
			img(placeholder("goods-hero"), "Obsidian wallet detail"),
			p(),
			p(
				styled(
					{ size: 24 },
					"The grain’s natural look is brought out through the tumbling process, creating a worn, textural black that feels true to what a leather should be.",
				),
				"center",
			),
			p(bold(styled({ size: 12 }, "-ROWAN, DESIGNER")), "center"),
			button("SHOP OBSIDIAN RANGE", { background: ORANGE, radius: 8, align: "center" }),
		],
	},
	footer: goodsFooter(),
});
