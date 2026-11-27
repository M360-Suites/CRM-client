import { FONTS, bold, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { wellnessFooter } from "./footers";

// Figma: "Third email - like Beam" (High Fidelity). Company name, logo and
// address are placeholders; everything else follows the design.
const BROWN = "#867356";
const INK = "#2E2A2B";

const product = (name: string, text: string) => [
	img(placeholder("wellness-tile"), name),
	p(bold(name)),
	p(text),
	p(link("https://", bold(styled({ size: 13 }, "SHOP NOW")))),
];

export default starter({
	id: "flash-sale",
	name: "Spring Flash Sale",
	description:
		"A 48-hour sale: an offer banner, a bold hero with one button and four best-sellers in a two-column grid.",
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
			p(styled({ size: 14 }, "$25 OFF OUR BEST-SELLERS"), "center"),
			p(bold(styled({ size: 28 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 64 }, ["SPRING FLASH SALE", br, "Take $25 off"]), "center"),
			p(
				styled(
					{ size: 18 },
					"Hibernation season is officially over, and we’re celebrating with a 48-hour Flash Sale. Refresh your health and wellness goals during the Spring Equinox.",
				),
				"center",
			),
			button("SHOP NOW", { background: "#FFFFFF", color: INK, align: "center" }),
			img(placeholder("wellness-hero"), "Spring Flash Sale"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 24,
		content: [
			columns(
				[
					product("Cinnamon Cocoa Nightcap", "The healthy nighttime blend for better sleep."),
					product("Radiance", "Hormone-balancing blend for daily wellness."),
				],
				{ gap: 32 },
			),
			columns(
				[
					product("Nightcap Capsules", "Essential sleep support, even on the go."),
					product("Everyday Minis", "Perfect for sharing or sampling your favorites in smaller sizes."),
				],
				{ gap: 32 },
			),
		],
	},
	footer: wellnessFooter(),
});
