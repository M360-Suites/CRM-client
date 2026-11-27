import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Sixth email - Like Birdies" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const INK = "#0E0E0E";

const swatch = (colour: string) => [
	img(placeholder("fashion-wide"), `${colour} styles`),
	p(link("https://", bold(`SHOP ${colour}`)), "center"),
];

export default starter({
	id: "shop-by-colour",
	name: "Shop the Rainbow",
	description:
		"A headline and hero, then eight colour tiles in a two-column grid so people jump straight to their shade.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: INK,
	},
	header: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 48,
		padding_x: 24,
		content: [
			p(bold(styled({ size: 22 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 56 }, "shop the rainbow"), "center"),
			p(
				styled(
					{ size: 18 },
					"Do you love neutrals or do you prefer a statement shade? Shop styles in a hue that matches you.",
				),
				"center",
			),
			button("SHOP NOW", { background: INK, radius: 0, align: "center" }),
			img(placeholder("fashion-hero"), "Shoes in every colour"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 32,
		content: [
			columns([swatch("BLACK"), swatch("NEUTRAL")]),
			columns([swatch("RED"), swatch("BROWN")]),
			columns([swatch("PINK"), swatch("BLUE")]),
			columns([swatch("GREEN"), swatch("GOLD")]),
		],
	},
	footer: fashionFooter(),
});
