import { FONTS, bold, button, h, img, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Third email - Like Birdies" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const INK = "#0E0E0E";
const CREAM = "#FFFBF8";

const shopNow = () => button("SHOP NOW", { background: INK, radius: 0, align: "center" });

export default starter({
	id: "lookbook",
	name: "Mary Jane Season",
	description:
		"Show how customers style a product: a headline and button, then two large looks, each with a caption and a shop button.",
	category: "library",
	style: {
		background_color: CREAM,
		content_background: CREAM,
		content_width: 520,
		font_family: FONTS.modern,
		link_color: INK,
	},
	header: {
		background_color: CREAM,
		text_color: INK,
		padding_y: 48,
		padding_x: 24,
		content: [
			p(bold(styled({ size: 22 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 72 }, "mary jane"), "center"),
			p(bold(styled({ size: 24 }, "SEASON")), "center"),
			p(
				styled({ size: 18 }, "Find fresh ways to style yours this spring, just like our flock."),
				"center",
			),
			shopNow(),
		],
	},
	body: {
		background_color: CREAM,
		text_color: INK,
		padding_y: 0,
		padding_x: 0,
		content: [
			img(placeholder("fashion-wide"), "Sarah's look"),
			p(
				styled({ size: 18 }, "Sarah’s all-denim look is perfect for hosting in casual-chic style."),
				"center",
			),
			shopNow(),
			p(),
			img(placeholder("fashion-wide"), "Caitlyn's look"),
			p(
				styled({ size: 18 }, "Caitlyn proves timeless classics create an effortless, put-together look."),
				"center",
			),
			shopNow(),
			p(),
		],
	},
	footer: fashionFooter(CREAM),
});
