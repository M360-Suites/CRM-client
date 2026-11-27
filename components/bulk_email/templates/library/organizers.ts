import { FONTS, bold, button, h, img, p, placeholder, starter, styled } from "./nodes";
import { goodsFooter, linkRow } from "./footers";

// Figma: "Fifth email - Like Bellroy" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const ORANGE = "#F34D01";
const TEAL = "#609C9D";
const DARK = "#333436";

export default starter({
	id: "organizers",
	name: "More Order, Less Stress",
	description:
		"Lead with an everyday problem, show two products that solve it with a button each, then a dark closing band.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#F6F7F9",
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
			img(placeholder("goods-hero"), "Organizers"),
			h(1, styled({ size: 48 }, "More order, less stress"), "center"),
			p(
				styled(
					{ size: 18 },
					"Cables in chaos? Keys a-jungle? Disorganization can be stressful, so these clever accessories wrangle your everyday gear in intuitive ways. To keep you in control, and on top of your game.",
				),
				"center",
			),
		],
	},
	body: {
		background_color: "#F6F7F9",
		text_color: DARK,
		padding_y: 24,
		padding_x: 24,
		content: [
			img(placeholder("goods-wide"), "Tech kit"),
			p(
				styled({ size: 18 }, "Tame the tangle, with designated spots for all your cables and tech bits."),
				"center",
			),
			button("SHOP TECH KIT", { background: "#304392", radius: 8, align: "center" }),
			p(),
			img(placeholder("goods-wide"), "Key case"),
			p(
				styled({ size: 18 }, "Go from noisy to ninja, with this sleek hardshell key organizer."),
				"center",
			),
			button("SHOP KEY CASE", { background: ORANGE, radius: 8, align: "center" }),
		],
	},
	footer: {
		...goodsFooter(),
		background_color: DARK,
		text_color: "#FFFFFF",
		content: [
			img(placeholder("goods-side"), "Accessories"),
			h(1, styled({ size: 44 }, "More great problem solvers"), "center"),
			button("SHOP ACCESSORIES", { background: ORANGE, radius: 8, align: "center" }),
			p(),
			...goodsFooter().content,
		],
	},
});
