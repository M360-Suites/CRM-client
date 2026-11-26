import { FONTS, bold, br, button, h, img, p, placeholder, starter, styled } from "./nodes";
import { wellnessFooter } from "./footers";

// Figma: "Fifth email - like Beam" (High Fidelity). Company name, logo,
// product name and address are placeholders; everything else follows the design.
const BROWN = "#867356";
const INK = "#2E2A2B";

export default starter({
	id: "meet-the-product",
	name: "Meet the Product",
	description:
		"Introduce one product with a discount code, a hero, a short intro and three full-width photos of its flavours.",
	category: "library",
	style: {
		background_color: "#F7F4EF",
		content_background: "#FFFFFF",
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: BROWN,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 24,
		content: [
			p(styled({ size: 14 }, "Get 15% off with code GET 15"), "center"),
			p(bold(styled({ size: 28 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 64 }, ["DISCOVER BETTER SLEEP", br, "Meet Nightcap"]), "center"),
			p(
				styled(
					{ size: 18 },
					"Meet the healthy hot cocoa that’s packed with five sleep-promoting ingredients to help you fall asleep, stay asleep, and wake up refreshed.",
				),
				"center",
			),
			button("SAVE ON NIGHTCAP", { background: "#FFFFFF", color: INK, align: "center" }),
			img(placeholder("wellness-hero"), "Nightcap"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 40,
		padding_x: 24,
		content: [
			h(1, styled({ size: 40 }, "The flavor of your Dreams"), "center"),
			p(
				"Discover over nine different blends made with all-natural flavors, zero added sugar, and melatonin.",
				"center",
			),
			img(placeholder("wellness-hero"), "Flavor one"),
			img(placeholder("wellness-hero"), "Flavor two"),
			img(placeholder("wellness-hero"), "Flavor three"),
			button("GET 15% OFF", { background: INK, align: "center" }),
		],
	},
	footer: wellnessFooter(),
});
